<?php

namespace Database\Seeders;

use App\Models\FinancialGoal;
use App\Models\User;
use Illuminate\Database\Seeder;

class GoalSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            FinancialGoal::create([
                'user_id' => $user->id,
                'name' => 'Emergency Fund',
                'description' => 'Build emergency fund for 6 months',
                'goal_type' => 'Savings',
                'target_amount' => 10000,
                'current_amount' => 2000,
                'start_date' => now()->subMonths(3),
                'target_date' => now()->addMonths(9),
                'priority' => 'high',
                'color' => '#EF4444',
                'is_active' => true,
            ]);

            FinancialGoal::create([
                'user_id' => $user->id,
                'name' => 'Vacation Fund',
                'description' => 'Save for summer vacation',
                'goal_type' => 'Travel',
                'target_amount' => 5000,
                'current_amount' => 1500,
                'start_date' => now()->subMonths(2),
                'target_date' => now()->addMonths(4),
                'priority' => 'medium',
                'color' => '#F59E0B',
                'is_active' => true,
            ]);
        }
    }
}
