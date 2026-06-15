<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $sampleTransactions = [
            ['type' => 'income', 'category' => 'Gaji', 'amount' => 12500000, 'desc' => 'Gaji bulanan Mei', 'method' => 'BCA', 'days_ago' => 6],
            ['type' => 'expense', 'category' => 'Makanan', 'amount' => 185000, 'desc' => 'Makan siang tim', 'method' => 'Cash', 'days_ago' => 6],
            ['type' => 'expense', 'category' => 'Transportasi', 'amount' => 75000, 'desc' => 'Gojek ke kantor', 'method' => 'GoPay', 'days_ago' => 7],
            ['type' => 'income', 'category' => 'Freelance', 'amount' => 3500000, 'desc' => 'Project landing page', 'method' => 'BCA', 'days_ago' => 9],
            ['type' => 'expense', 'category' => 'Belanja', 'amount' => 420000, 'desc' => 'Groceries Tokopedia', 'method' => 'BCA', 'days_ago' => 10],
            ['type' => 'expense', 'category' => 'Hiburan', 'amount' => 159000, 'desc' => 'Netflix + Spotify', 'method' => 'Mandiri', 'days_ago' => 12],
            ['type' => 'expense', 'category' => 'Tagihan', 'amount' => 850000, 'desc' => 'Listrik & Internet', 'method' => 'BCA', 'days_ago' => 14],
            ['type' => 'income', 'category' => 'Investasi', 'amount' => 980000, 'desc' => 'Dividen reksadana', 'method' => 'BCA', 'days_ago' => 16],
            ['type' => 'expense', 'category' => 'Kesehatan', 'amount' => 350000, 'desc' => 'Vitamin & checkup', 'method' => 'BCA', 'days_ago' => 19],
            ['type' => 'expense', 'category' => 'Makanan', 'amount' => 92000, 'desc' => 'Kopi & sarapan', 'method' => 'OVO', 'days_ago' => 20],
            ['type' => 'expense', 'category' => 'Pendidikan', 'amount' => 1250000, 'desc' => 'Kursus online UX', 'method' => 'BCA', 'days_ago' => 24],
            ['type' => 'income', 'category' => 'Bonus', 'amount' => 2000000, 'desc' => 'Bonus Q1', 'method' => 'BCA', 'days_ago' => 29],
        ];

        foreach ($users as $user) {
            foreach ($sampleTransactions as $tx) {
                // Find or create category
                $category = \App\Models\Category::firstOrCreate(
                    ['name' => $tx['category'], 'user_id' => $user->id],
                    [
                        'type' => $tx['type'],
                        'slug' => \Illuminate\Support\Str::slug($tx['category']),
                        'is_custom' => false,
                    ]
                );

                Transaction::create([
                    'user_id' => $user->id,
                    'category_id' => $category->id,
                    'amount' => $tx['amount'],
                    'type' => $tx['type'],
                    'description' => $tx['desc'],
                    'notes' => $tx['desc'],
                    'transaction_date' => now()->subDays($tx['days_ago']),
                    'payment_method' => $tx['method'],
                ]);
            }
        }
    }
}
