<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\User;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $budgetTemplates = [
            ['name' => 'Makanan', 'amount' => 2000000, 'color' => '#F59E0B'],
            ['name' => 'Transportasi', 'amount' => 800000, 'color' => '#06B6D4'],
            ['name' => 'Belanja', 'amount' => 1500000, 'color' => '#3B82F6'],
            ['name' => 'Hiburan', 'amount' => 500000, 'color' => '#8B5CF6'],
            ['name' => 'Tagihan', 'amount' => 1000000, 'color' => '#1E3A8A'],
            ['name' => 'Kesehatan', 'amount' => 600000, 'color' => '#EF4444'],
        ];

        foreach ($users as $user) {
            foreach ($budgetTemplates as $tpl) {
                Budget::create([
                    'user_id' => $user->id,
                    'name' => $tpl['name'],
                    'description' => 'Budget ' . $tpl['name'] . ' bulanan',
                    'amount' => $tpl['amount'],
                    'period' => 'monthly',
                    'start_date' => now()->startOfMonth(),
                    'end_date' => now()->endOfMonth(),
                    'is_active' => true,
                    'color' => $tpl['color'],
                ]);
            }
        }
    }
}
