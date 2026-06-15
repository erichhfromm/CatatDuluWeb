<?php

namespace App\Support;

use App\Models\Transaction;
use App\Models\User;
use App\Services\AnalyticsService;
use App\Services\TransactionService;
use Carbon\Carbon;

final class CatatDuluViewData
{
    public function __construct(
        private AnalyticsService $analytics,
        private TransactionService $transactions,
    ) {}

    public function forGuest(): array
    {
        return CatatDuluData::all();
    }

    public function forUser(User $user, ?\Illuminate\Http\Request $request = null): array
    {
        $currentMonth = [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
        $lastMonth = [
            Carbon::now()->subMonth()->startOfMonth(),
            Carbon::now()->subMonth()->endOfMonth(),
        ];

        $monthlyIncome = (float) $user->monthly_income;
        $monthlyExpense = (float) $user->monthly_expense;
        $lastMonthIncome = $this->transactions->getTotalIncome($user, ...$lastMonth);
        $lastMonthExpense = $this->transactions->getTotalExpense($user, ...$lastMonth);

        return [
            'transactions' => $this->mapTransactions($user, $request),
            'monthlyTrend' => $this->mapMonthlyTrend($user),
            'expenseByCategory' => $this->mapExpenseByCategory($user),
            'budgets' => $this->mapBudgets($user),
            'notifications' => $this->mapNotifications($user),
            'dashboardStats' => [
                'total_balance' => (float) $user->total_balance,
                'monthly_income' => $monthlyIncome,
                'monthly_expense' => $monthlyExpense,
                'net_monthly' => $monthlyIncome - $monthlyExpense,
                'income_change' => $this->formatPercentChange($monthlyIncome, $lastMonthIncome),
                'expense_change' => $this->formatPercentChange($monthlyExpense, $lastMonthExpense),
                'savings_change' => $this->formatPercentChange(
                    $monthlyIncome - $monthlyExpense,
                    $lastMonthIncome - $lastMonthExpense
                ),
            ],
        ];
    }

    public static function mapTransactionRow(Transaction $transaction): array
    {
        $transaction->loadMissing('category');

        return [
            'db_id' => $transaction->id,
            'id' => 'TX-' . $transaction->id,
            'type' => $transaction->type,
            'category' => $transaction->category->name ?? 'Lainnya',
            'category_name' => $transaction->category->name ?? 'Lainnya',
            'amount' => (float) $transaction->amount,
            'date' => $transaction->transaction_date->format('Y-m-d'),
            'note' => $transaction->description ?? $transaction->notes ?? '',
            'account' => $transaction->payment_method ?? 'Cash',
            'status' => $transaction->status,
        ];
    }

    private function mapTransactions(User $user, ?\Illuminate\Http\Request $request = null): array
    {
        $query = $user->transactions()->with('category')->orderBy('transaction_date', 'desc');
        
        if ($request && $request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($qc) use ($search) {
                      $qc->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Report filters
        if ($request && $request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('transaction_date', [
                $request->input('start_date'),
                $request->input('end_date')
            ]);
        }
        
        if ($request && $request->filled('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }

        return $query
            ->get()
            ->map(fn ($t) => self::mapTransactionRow($t))
            ->values()
            ->all();
    }

    private function mapMonthlyTrend(User $user): array
    {
        return $this->analytics
            ->getMonthlyTrend($user, 6)
            ->map(fn ($row) => [
                'month' => self::monthLabel($row['month']),
                'income' => (float) $row['income'],
                'expense' => (float) $row['expense'],
            ])
            ->values()
            ->all();
    }

    private function mapExpenseByCategory(User $user): array
    {
        return $this->analytics
            ->getCategoryBreakdown($user, 'expense')
            ->map(fn ($item) => [
                'name' => $item['category_name'],
                'value' => (float) $item['total'],
                'color' => $item['color'] ?? '#3B82F6',
            ])
            ->values()
            ->all();
    }

    private function mapBudgets(User $user): array
    {
        return $user->budgets()
            ->with('categories.category.transactions')
            ->get()
            ->map(fn ($b) => [
                'id' => 'b' . $b->id,
                'category' => $b->name,
                'allocated' => (float) $b->amount,
                'spent' => $b->spent_amount,
                'color' => $b->color ?? '#3B82F6',
            ])
            ->values()
            ->all();
    }

    private function mapNotifications(User $user): array
    {
        return $user->notifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($n) => [
                'id' => 'n' . $n->id,
                'title' => $n->title,
                'desc' => $n->message,
                'time' => $n->created_at->diffForHumans(),
                'read' => (bool) $n->is_read,
                'type' => $n->type,
            ])
            ->values()
            ->all();
    }

    private function formatPercentChange(float $current, float $previous): string
    {
        if ($previous == 0.0) {
            return $current > 0 ? '+100%' : '0%';
        }

        $pct = round((($current - $previous) / $previous) * 100, 1);

        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }

    public static function monthLabel(string $yearMonth): string
    {
        $month = (int) substr($yearMonth, 5, 2);
        $labels = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];

        return $labels[$month] ?? $yearMonth;
    }

    public static function currentMonthLabel(): string
    {
        $labels = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return ($labels[(int) now()->format('n')] ?? '') . ' ' . now()->format('Y');
    }
}
