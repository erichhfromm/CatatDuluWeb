<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\BudgetAlert;
use App\Models\User;
use Illuminate\Support\Collection;

class BudgetService
{
    public function checkBudgetAlerts(User $user): void
    {
        $budgets = $user->budgets()->active()->get();

        foreach ($budgets as $budget) {
            $this->checkBudgetThresholds($budget);
        }
    }

    private function checkBudgetThresholds(Budget $budget): void
    {
        $percentageUsed = $budget->percentage_used;

        $alerts = [
            ['threshold' => 100, 'type' => 'critical'],
            ['threshold' => 80, 'type' => 'warning'],
        ];

        foreach ($alerts as $alert) {
            $existingAlert = $budget->alerts()
                ->where('alert_type', $alert['type'])
                ->first();

            if ($percentageUsed >= $alert['threshold'] && !$existingAlert?->is_triggered) {
                $this->triggerAlert($budget, $alert['type'], $alert['threshold']);
            }
        }
    }

    private function triggerAlert(Budget $budget, string $type, int $threshold): void
    {
        $alert = $budget->alerts()->create([
            'alert_type' => $type,
            'threshold_percentage' => $threshold,
            'message' => "Your budget '{$budget->name}' has reached {$threshold}% ({$budget->percentage_used}%)",
        ]);

        $alert->trigger();
    }

    public function getBudgetSummary(User $user): array
    {
        $budgets = $user->budgets()->active()->get();

        $totalAllocated = (float) $budgets->sum('amount');
        $totalSpent = (float) $budgets->sum('spent_amount');
        $totalRemaining = max(0, $totalAllocated - $totalSpent);
        $averageUtilization = $totalAllocated > 0
            ? round(($totalSpent / $totalAllocated) * 100, 2)
            : 0;

        return [
            'total_allocated' => $totalAllocated,
            'total_spent' => $totalSpent,
            'total_remaining' => $totalRemaining,
            'average_utilization' => $averageUtilization,
            'budgets_count' => $budgets->count(),
            'budgets_on_track' => $budgets->where('status', '!=', 'exceeded')->count(),
            'budgets_exceeded' => $budgets->where('status', 'exceeded')->count(),
        ];
    }

    public function getBudgetBreakdown(Budget $budget): Collection
    {
        return $budget->categories()
            ->with('category')
            ->get()
            ->map(fn ($bc) => [
                'category_id' => $bc->category_id,
                'category_name' => $bc->category->name,
                'allocated' => (float) $bc->allocated_amount,
                'spent' => (float) $bc->spent_amount,
                'remaining' => (float) $bc->remaining_amount,
                'percentage' => $bc->allocated_amount > 0
                    ? round(($bc->spent_amount / $bc->allocated_amount) * 100, 2)
                    : 0,
            ]);
    }
}
