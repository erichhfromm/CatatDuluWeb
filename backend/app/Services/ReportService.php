<?php

namespace App\Services;

use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;

class ReportService
{
    public function __construct(
        private TransactionService $transactionService,
        private BudgetService $budgetService,
        private GoalService $goalService,
    ) {}

    public function generateSummaryReport(User $user): array
    {
        return [
            'period' => now()->format('F Y'),
            'income' => $this->transactionService->getTotalIncome($user),
            'expenses' => $this->transactionService->getTotalExpense($user),
            'net' => $this->transactionService->getNetBalance($user),
            'budget_summary' => $this->budgetService->getBudgetSummary($user),
            'goal_summary' => $this->goalService->getGoalSummary($user),
        ];
    }

    public function generateDetailedReport(User $user): array
    {
        $summaryData = $this->generateSummaryReport($user);

        return array_merge($summaryData, [
            'by_category' => $this->transactionService->getMonthlyExpenseByCategory($user),
            'transactions' => $user->transactions()
                ->whereMonth('transaction_date', now()->month)
                ->orderBy('transaction_date', 'desc')
                ->get()
                ->map(fn ($t) => [
                    'date' => $t->transaction_date->format('Y-m-d'),
                    'category' => $t->category->name,
                    'description' => $t->description,
                    'amount' => (float) $t->amount,
                    'type' => $t->type,
                ])
                ->toArray(),
        ]);
    }

    public function generateComparativeReport(User $user, int $months = 12): Collection
    {
        $data = collect();

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $from = $date->clone()->startOfMonth();
            $to = $date->clone()->endOfMonth();

            $income = $this->transactionService->getTotalIncome($user, $from, $to);
            $expense = $this->transactionService->getTotalExpense($user, $from, $to);

            $data->push([
                'month' => $date->format('F Y'),
                'income' => $income,
                'expense' => $expense,
                'net' => $income - $expense,
                'savings_rate' => $income > 0 ? round((($income - $expense) / $income) * 100, 2) : 0,
            ]);
        }

        return $data;
    }

    public function generateForecastReport(User $user, int $months = 12): array
    {
        $monthlyAverage = $user->transactions()
            ->whereYear('transaction_date', now()->year)
            ->average('amount');

        $forecast = [];
        for ($i = 1; $i <= $months; $i++) {
            $date = now()->addMonths($i);
            $forecast[] = [
                'month' => $date->format('F Y'),
                'projected_expense' => round($monthlyAverage * $i, 2),
                'trend' => $i > 1 ? 'stable' : 'baseline',
            ];
        }

        return $forecast;
    }

    public function exportToPdf(array $reportData): string
    {
        $pdf = Pdf::loadView('reports.pdf', ['data' => $reportData]);
        $filePath = 'reports/' . now()->format('Y-m-d_H-i-s') . '.pdf';
        $pdf->save(storage_path('app/public/' . $filePath));

        return $filePath;
    }

    public function exportToCsv(User $user): string
    {
        $transactions = $user->transactions()
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get();

        $filePath = 'exports/' . now()->format('Y-m-d_H-i-s') . '.csv';
        $file = fopen(storage_path('app/public/' . $filePath), 'w');

        fputcsv($file, ['Date', 'Category', 'Description', 'Amount', 'Type', 'Payment Method']);

        foreach ($transactions as $transaction) {
            fputcsv($file, [
                $transaction->transaction_date->format('Y-m-d'),
                $transaction->category->name,
                $transaction->description,
                $transaction->amount,
                $transaction->type,
                $transaction->payment_method,
            ]);
        }

        fclose($file);

        return $filePath;
    }
}
