<?php

namespace App\Policies;

use App\Models\FinancialGoal;
use App\Models\User;

class GoalPolicy
{
    public function view(User $user, FinancialGoal $goal): bool
    {
        return $user->id === $goal->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, FinancialGoal $goal): bool
    {
        return $user->id === $goal->user_id;
    }

    public function delete(User $user, FinancialGoal $goal): bool
    {
        return $user->id === $goal->user_id;
    }
}
