<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AnalyticsService
{
    public function __construct(
        private TransactionService $transactionService,
        private BudgetService $budgetService,
        private GoalService $goalService,
    ) {}

    public function getDashboardStats(User $user): array
    {
        $currentMonth = [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth(),
        ];

        $lastMonth = [
            Carbon::now()->subMonth()->startOfMonth(),
            Carbon::now()->subMonth()->endOfMonth(),
        ];

        return [
            'balance' => [
                'total' => (float) $user->total_balance,
                'monthly_income' => (float) $user->monthly_income,
                'monthly_expense' => (float) $user->monthly_expense,
                'net_monthly' => (float) ($user->monthly_income - $user->monthly_expense),
            ],
            'spending' => [
                'current_month' => $this->transactionService->getTotalExpense(
                    $user,
                    ...$currentMonth
                ),
                'last_month' => $this->transactionService->getTotalExpense(
                    $user,
                    ...$lastMonth
                ),
            ],
            'budget' => $this->budgetService->getBudgetSummary($user),
            'goals' => $this->goalService->getGoalSummary($user),
        ];
    }

    public function getMonthlyTrend(User $user, int $months = 12): Collection
    {
        $data = collect();

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $from = $date->clone()->startOfMonth();
            $to = $date->clone()->endOfMonth();

            $data->push([
                'month' => $date->format('Y-m'),
                'income' => $this->transactionService->getTotalIncome($user, $from, $to),
                'expense' => $this->transactionService->getTotalExpense($user, $from, $to),
                'net' => $this->transactionService->getNetBalance($user, $from, $to),
            ]);
        }

        return $data;
    }

    public function getCategoryBreakdown(User $user, string $type = 'expense'): Collection
    {
        return $user->transactions()
            ->where('type', $type)
            ->whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(fn ($group) => [
                'category_id' => $group->first()->category_id,
                'category_name' => $group->first()->category->name,
                'color' => $group->first()->category->color,
                'total' => (float) $group->sum('amount'),
                'percentage' => 0,
                'count' => $group->count(),
            ])
            ->pipe(fn ($grouped) => $grouped->each(fn ($item) => $item['percentage'] = round(
                ($item['total'] / $grouped->sum('total')) * 100,
                2
            )))
            ->sortByDesc('total')
            ->values();
    }

    public function getSpendingPatterns(User $user): array
    {
        $transactions = $user->transactions()
            ->whereYear('transaction_date', now()->year)
            ->whereMonth('transaction_date', now()->month)
            ->get();

        $paymentMethods = $transactions
            ->groupBy('payment_method')
            ->map(fn ($group) => [
                'method' => $group->first()->payment_method,
                'total' => (float) $group->sum('amount'),
                'count' => $group->count(),
            ])
            ->values()
            ->toArray();

        $weekdays = [];
        for ($i = 1; $i <= 7; $i++) {
            $dayTransactions = $transactions->filter(fn ($t) => $t->transaction_date->dayOfWeek == $i);
            $weekdays[$i] = [
                'day' => $this->getDayName($i),
                'total' => (float) $dayTransactions->sum('amount'),
                'count' => $dayTransactions->count(),
            ];
        }

        return [
            'payment_methods' => $paymentMethods,
            'by_weekday' => $weekdays,
            'average_per_transaction' => $this->transactionService->getAverageTransaction($user, 'expense'),
        ];
    }

    public function getComparisonStats(User $user, Carbon $from, Carbon $to): array
    {
        $income = $this->transactionService->getTotalIncome($user, $from, $to);
        $expense = $this->transactionService->getTotalExpense($user, $from, $to);
        $net = $income - $expense;

        $savingsRate = $income > 0 ? round(($net / $income) * 100, 2) : 0;

        return [
            'period' => "{$from->format('Y-m-d')} to {$to->format('Y-m-d')}",
            'income' => $income,
            'expense' => $expense,
            'net' => $net,
            'savings_rate' => $savingsRate,
            'days_count' => $from->diffInDays($to) + 1,
            'average_daily_spend' => round($expense / ($from->diffInDays($to) + 1), 2),
        ];
    }

    private function getDayName(int $dayOfWeek): string
    {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][$dayOfWeek - 1] ?? 'Unknown';
    }
}
