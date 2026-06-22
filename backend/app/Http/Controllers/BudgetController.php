<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use App\Services\BudgetService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function __construct(private BudgetService $service) {}

    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $query = auth()->user()->budgets()->with('categories.category', 'alerts');

        if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->has('period')) {
            $query->where('period', $request->period);
        }

        if ($request->has('from_date')) {
            $query->where('start_date', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('end_date', '<=', $request->to_date);
        }

        $budgets = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return BudgetResource::collection($budgets);
    }

    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $user      = auth()->user();
        $validated = $request->validated();
        $categories = $validated['categories'] ?? [];
        unset($validated['categories']);

        $budget = $user->budgets()->create($validated);

        if ($categories) {
            foreach ($categories as $category) {
                $budget->categories()->create($category);
            }
        }

        $budget->load('categories.category', 'alerts');

        // 🔔 Notifikasi saat budget baru dibuat
        NotificationService::budgetCreated($user, $budget->name, (float) $budget->amount, $budget->id);

        return response()->json(new BudgetResource($budget), 201);
    }

    public function show(Budget $budget): JsonResponse
    {
        $this->authorize('view', $budget);

        return response()->json(
            new BudgetResource($budget->load('categories.category', 'alerts'))
        );
    }

    public function update(StoreBudgetRequest $request, Budget $budget): JsonResponse
    {
        $this->authorize('update', $budget);

        $validated  = $request->validated();
        $categories = $validated['categories'] ?? [];
        unset($validated['categories']);

        $budget->update($validated);

        if ($categories) {
            $budget->categories()->delete();
            foreach ($categories as $category) {
                $budget->categories()->create($category);
            }
        }

        return response()->json(
            new BudgetResource($budget->load('categories.category', 'alerts'))
        );
    }

    public function destroy(Budget $budget): JsonResponse
    {
        $this->authorize('delete', $budget);

        $user = auth()->user();
        $name = $budget->name;

        $budget->delete();

        // 🔔 Notifikasi saat budget dihapus
        NotificationService::budgetDeleted($user, $name);

        return response()->json(['message' => 'Budget deleted successfully']);
    }

    public function summary(): JsonResponse
    {
        return response()->json($this->service->getBudgetSummary(auth()->user()));
    }

    public function checkAlerts(): JsonResponse
    {
        $this->service->checkBudgetAlerts(auth()->user());

        return response()->json(['message' => 'Budget alerts checked']);
    }

    public function breakdown(Budget $budget): JsonResponse
    {
        $this->authorize('view', $budget);

        return response()->json([
            'budget'    => new BudgetResource($budget),
            'breakdown' => $this->service->getBudgetBreakdown($budget),
        ]);
    }
}
