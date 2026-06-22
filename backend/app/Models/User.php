<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'otp_code', // Tambahan agar OTP bisa disimpan ke database lewat User::create atau $user->update
        'currency',
        'date_format',
        'theme',
        'preferences',
        'is_active',
        'subscription_type',
        'subscription_until',
        'profile_picture',
        'bio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'subscription_until' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'preferences' => 'array',
    ];

    protected $appends = [
        'total_balance',
        'monthly_expense',
        'monthly_income',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public function goals(): HasMany
    {
        return $this->hasMany(FinancialGoal::class);
    }

    // ✅ Diganti nama agar tidak konflik dengan relasi notifications() bawaan trait Notifiable
    public function appNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function getTotalBalanceAttribute(): float
    {
        return $this->transactions()
            ->where('type', 'income')
            ->sum('amount') - $this->transactions()
            ->where('type', 'expense')
            ->sum('amount');
    }

    public function getMonthlyExpenseAttribute(): float
    {
        return (float) $this->transactions()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ])
            ->sum('amount');
    }

    public function getMonthlyIncomeAttribute(): float
    {
        return (float) $this->transactions()
            ->where('type', 'income')
            ->whereBetween('transaction_date', [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ])
            ->sum('amount');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithSubscription($query)
    {
        return $query->where('subscription_until', '>', now());
    }
}