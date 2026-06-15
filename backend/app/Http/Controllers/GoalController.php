<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Resources\GoalResource;
use App\Models\FinancialGoal;
use App\Services\GoalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function __construct(private GoalService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->goals()->with('progress');

        if ($request->has('status') && in_array($request->status, ['active', 'completed', 'at_risk'])) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'completed') {
                $query->whereRaw('current_amount >= target_amount');
            }
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        $goals = $query->orderBy('target_date')
            ->paginate($request->get('per_page', 15));

        return response()->json(GoalResource::collection($goals));
    }

    public function store(StoreGoalRequest $request): JsonResponse
    {
        $goal = auth()->user()->goals()->create($request->validated());

        return response()->json(
            new GoalResource($goal->load('progress')),
            201
        );
    }

    public function show(FinancialGoal $goal): JsonResponse
    {
        $this->authorize('view', $goal);

        return response()->json(
            new GoalResource($goal->load('progress'))
        );
    }

    public function update(StoreGoalRequest $request, FinancialGoal $goal): JsonResponse
    {
        $this->authorize('update', $goal);

        $goal->update($request->validated());

        return response()->json(
            new GoalResource($goal->load('progress'))
        );
    }

    public function destroy(FinancialGoal $goal): JsonResponse
    {
        $this->authorize('delete', $goal);

        $goal->delete();

        return response()->json(['message' => 'Goal deleted successfully']);
    }

    public function recordProgress(Request $request, FinancialGoal $goal): JsonResponse
    {
        $this->authorize('update', $goal);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $progress = $this->service->recordProgress(
            $goal,
            $validated['amount'],
            $validated['notes'] ?? null
        );

        return response()->json([
            'message' => 'Progress recorded successfully',
            'goal' => new GoalResource($goal->load('progress')),
            'progress' => $progress,
        ]);
    }

    public function summary(): JsonResponse
    {
        return response()->json($this->service->getGoalSummary(auth()->user()));
    }

    public function progress(FinancialGoal $goal): JsonResponse
    {
        $this->authorize('view', $goal);

        return response()->json([
            'goal' => new GoalResource($goal),
            'progress_history' => $this->service->getGoalProgress($goal),
            'projected_completion' => $this->service->getProjectedCompletion($goal),
            'milestones' => $this->service->checkGoalMilestones($goal),
        ]);
    }
}
