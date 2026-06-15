<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $incomeCategories = [
            ['name' => 'Salary', 'icon' => '💰', 'color' => '#10B981'],
            ['name' => 'Freelance', 'icon' => '💻', 'color' => '#3B82F6'],
            ['name' => 'Investment', 'icon' => '📈', 'color' => '#8B5CF6'],
            ['name' => 'Bonus', 'icon' => '🎁', 'color' => '#F59E0B'],
        ];

        $expenseCategories = [
            ['name' => 'Food & Dining', 'icon' => '🍔', 'color' => '#EF4444'],
            ['name' => 'Transportation', 'icon' => '🚗', 'color' => '#F97316'],
            ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#EC4899'],
            ['name' => 'Utilities', 'icon' => '💡', 'color' => '#06B6D4'],
            ['name' => 'Healthcare', 'icon' => '⚕️', 'color' => '#D946EF'],
            ['name' => 'Shopping', 'icon' => '🛍️', 'color' => '#8B5CF6'],
            ['name' => 'Education', 'icon' => '📚', 'color' => '#3B82F6'],
            ['name' => 'Rent', 'icon' => '🏠', 'color' => '#10B981'],
        ];

        foreach ($users as $user) {
            foreach ($incomeCategories as $cat) {
                Category::create(array_merge($cat, [
                    'user_id' => $user->id,
                    'type' => 'income',
                    'slug' => \Str::slug($cat['name']),
                    'is_custom' => false,
                ]));
            }

            foreach ($expenseCategories as $cat) {
                Category::create(array_merge($cat, [
                    'user_id' => $user->id,
                    'type' => 'expense',
                    'slug' => \Str::slug($cat['name']),
                    'is_custom' => false,
                ]));
            }
        }
    }
}
