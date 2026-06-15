<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Ariana Rizki',
            'email' => 'ariana@catatdulu.id',
            'password' => bcrypt('password123'),
            'currency' => 'IDR',
            'theme' => 'light',
            'is_active' => true,
            'subscription_type' => 'premium',
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'currency' => 'IDR',
            'theme' => 'light',
            'is_active' => true,
        ]);
    }
}
