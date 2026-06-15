<?php

namespace App\Services;

use App\Models\FinancialGoal;
use App\Models\GoalProgress;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class GoalService
{
    public function recordProgress(FinancialGoal $goal, float $amount, ?string $notes = null): GoalProgress
    {
        $progress = $goal->progress()->create([
            'amount' => $amount,
            'notes' => $notes,
            'recorded_date' => now(),
        ]);

        $goal->update([
            'current_amount' => $goal->current_amount + $amount,
        ]);

        return $progress;
    }

    public function getGoalSummary(User $user): array
    {
        $goals = $user->goals()->active()->get();

        $totalTargeted = (float) $goals->sum('target_amount');
        $totalProgress = (float) $goals->sum('current_amount');
        $completedGoals = $goals->where('current_amount', '>=', 'target_amount')->count();
        $atRiskGoals = $goals->where('status', 'at_risk')->count();
        $averageProgress = count($goals) > 0
            ? round(($totalProgress / $totalTargeted) * 100, 2)
            : 0;

        return [
            'total_targeted' => $totalTargeted,
            'total_progress' => $totalProgress,
            'average_progress' => $averageProgress,
            'completed_goals' => $completedGoals,
            'at_risk_goals' => $atRiskGoals,
            'total_goals' => $goals->count(),
        ];
    }

    public function getGoalProgress(FinancialGoal $goal): Collection
    {
        return $goal->progress()
            ->orderBy('recorded_date', 'desc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'amount' => (float) $p->amount,
                'notes' => $p->notes,
                'date' => $p->recorded_date->toIso8601String(),
                'cumulative' => $goal->current_amount - ($goal->current_amount - $p->amount),
            ]);
    }

    public function getProjectedCompletion(FinancialGoal $goal): ?Carbon
    {
        if ($goal->current_amount >= $goal->target_amount) {
            return $goal->updated_at;
        }

        $progressPerDay = $this->calculateAverageProgressPerDay($goal);

        if ($progressPerDay <= 0) {
            return null;
        }

        $daysNeeded = round(
            ($goal->target_amount - $goal->current_amount) / $progressPerDay
        );

        return now()->addDays($daysNeeded);
    }

    private function calculateAverageProgressPerDay(FinancialGoal $goal): float
    {
        $daysElapsed = $goal->start_date->diffInDays(now());

        if ($daysElapsed === 0) {
            return 0;
        }

        return $goal->current_amount / $daysElapsed;
    }

    public function checkGoalMilestones(FinancialGoal $goal): array
    {
        $milestones = [];
        $targetAmount = (float) $goal->target_amount;

        foreach ([0.25, 0.5, 0.75, 1] as $percentage) {
            $threshold = $targetAmount * $percentage;
            $isReached = $goal->current_amount >= $threshold;
            $milestones[intval($percentage * 100)] = [
                'percentage' => intval($percentage * 100),
                'amount' => $threshold,
                'reached' => $isReached,
            ];
        }

        return $milestones;
    }
}
