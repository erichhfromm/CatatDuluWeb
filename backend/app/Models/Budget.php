<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'amount',
        'period',
        'start_date',
        'end_date',
        'is_active',
        'color',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'spent_amount',
        'remaining_amount',
        'percentage_used',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(BudgetCategory::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(BudgetAlert::class);
    }

    public function getSpentAmountAttribute(): float
    {
        return (float) $this->categories()
            ->with('category.transactions')
            ->get()
            ->sum(fn ($bc) => $bc->category->transactions()
                ->whereBetween('transaction_date', [
                    $this->start_date,
                    $this->end_date,
                ])
                ->sum('amount'));
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, (float) ($this->amount - $this->spent_amount));
    }

    public function getPercentageUsedAttribute(): float
    {
        if ($this->amount == 0) {
            return 0;
        }
        return round(($this->spent_amount / $this->amount) * 100, 2);
    }

    public function getStatusAttribute(): string
    {
        $percentage = $this->percentage_used;
        if ($percentage >= 100) {
            return 'exceeded';
        } elseif ($percentage >= 80) {
            return 'warning';
        } elseif ($percentage >= 50) {
            return 'moderate';
        }
        return 'healthy';
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByPeriod($query, string $period)
    {
        return $query->where('period', $period);
    }

    public function scopeCurrent($query)
    {
        return $query->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }
}
