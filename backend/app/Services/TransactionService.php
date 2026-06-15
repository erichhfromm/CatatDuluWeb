<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class TransactionService
{
    public function getTotalExpense(User $user, ?Carbon $from = null, ?Carbon $to = null): float
    {
        $query = $user->transactions()->where('type', 'expense');

        if ($from && $to) {
            $query->whereBetween('transaction_date', [$from, $to]);
        }

        return (float) $query->sum('amount');
    }

    public function getTotalIncome(User $user, ?Carbon $from = null, ?Carbon $to = null): float
    {
        $query = $user->transactions()->where('type', 'income');

        if ($from && $to) {
            $query->whereBetween('transaction_date', [$from, $to]);
        }

        return (float) $query->sum('amount');
    }

    public function getNetBalance(User $user, ?Carbon $from = null, ?Carbon $to = null): float
    {
        return $this->getTotalIncome($user, $from, $to) - $this->getTotalExpense($user, $from, $to);
    }

    public function getMonthlyExpenseByCategory(User $user, ?int $month = null, ?int $year = null): Collection
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        return $user->transactions()
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $month)
            ->whereYear('transaction_date', $year)
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(fn ($group) => [
                'category_id' => $group->first()->category_id,
                'category_name' => $group->first()->category->name,
                'total' => (float) $group->sum('amount'),
                'count' => $group->count(),
            ]);
    }

    public function getAverageTransaction(User $user, string $type): float
    {
        $total = (float) $user->transactions()
            ->where('type', $type)
            ->sum('amount');
        $count = $user->transactions()->where('type', $type)->count();

        return $count > 0 ? $total / $count : 0;
    }

    public function getRecurringTransactions(User $user): Collection
    {
        return $user->transactions()->where('recurring', true)->get();
    }

    public function processRecurringTransactions(): void
    {
        $recurringTransactions = Transaction::where('recurring', true)->get();

        foreach ($recurringTransactions as $transaction) {
            if ($this->shouldCreateRecurringTransaction($transaction)) {
                $this->createRecurringTransactionCopy($transaction);
            }
        }
    }

    private function shouldCreateRecurringTransaction(Transaction $transaction): bool
    {
        $lastCreated = $transaction->updated_at ?? $transaction->created_at;

        return match ($transaction->recurring_frequency) {
            'daily' => $lastCreated->addDay()->isPast(),
            'weekly' => $lastCreated->addWeek()->isPast(),
            'monthly' => $lastCreated->addMonth()->isPast(),
            'yearly' => $lastCreated->addYear()->isPast(),
            default => false,
        };
    }

    private function createRecurringTransactionCopy(Transaction $transaction): void
    {
        $transaction->replicate()
            ->fill(['transaction_date' => now()])
            ->save();
    }
}
