<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'currency' => $user->currency,
            ],
            'balance' => [
                'total' => (float) $user->total_balance,
                'monthly_income' => (float) $user->monthly_income,
                'monthly_expense' => (float) $user->monthly_expense,
                'net_monthly' => (float) ($user->monthly_income - $user->monthly_expense),
            ],
            'summary' => [
                'transactions_count' => $user->transactions()->count(),
                'budgets_active' => $user->budgets()->active()->count(),
                'goals_active' => $user->goals()->active()->count(),
                'notifications_unread' => $user->notifications()->unread()->count(),
            ],
        ]);
    }

    public function recentTransactions(Request $request): JsonResponse
    {
        $limit = (int) $request->get('limit', 10);

        $transactions = auth()->user()->transactions()
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'transactions' => $transactions->map(fn ($t) => [
                'id' => $t->id,
                'category' => $t->category->name,
                'description' => $t->description,
                'amount' => (float) $t->amount,
                'type' => $t->type,
                'date' => $t->transaction_date->toIso8601String(),
            ]),
        ]);
    }
}
