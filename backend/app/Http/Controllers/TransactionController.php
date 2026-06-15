<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(private TransactionService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->transactions()->with('category', 'attachments');

        if ($request->has('type') && in_array($request->type, ['income', 'expense'])) {
            $query->where('type', $request->type);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('transaction_date', [
                $request->from_date,
                $request->to_date,
            ]);
        }

        if ($request->has('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $transactions = $query->orderBy('transaction_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json(TransactionResource::collection($transactions));
    }

    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $transaction = auth()->user()->transactions()->create($request->validated());

        return response()->json(
            new TransactionResource($transaction->load('category', 'attachments')),
            201
        );
    }

    public function show(Transaction $transaction): JsonResponse
    {
        $this->authorize('view', $transaction);

        return response()->json(
            new TransactionResource($transaction->load('category', 'attachments'))
        );
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): JsonResponse
    {
        $this->authorize('update', $transaction);

        $transaction->update($request->validated());

        return response()->json(
            new TransactionResource($transaction->load('category', 'attachments'))
        );
    }

    public function destroy(Transaction $transaction): JsonResponse
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array|min:1'])['ids'];

        $deleted = auth()->user()->transactions()
            ->whereIn('id', $ids)
            ->delete();

        return response()->json([
            'message' => "{$deleted} transactions deleted successfully",
            'deleted_count' => $deleted,
        ]);
    }

    public function monthlyStats(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'income' => $this->service->getTotalIncome($user),
            'expense' => $this->service->getTotalExpense($user),
            'balance' => $this->service->getNetBalance($user),
            'by_category' => $this->service->getMonthlyExpenseByCategory($user),
        ]);
    }
}
