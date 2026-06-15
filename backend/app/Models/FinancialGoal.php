<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FinancialGoal extends Model
{
    use HasFactory;

    protected $table = 'financial_goals';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'goal_type',
        'target_amount',
        'current_amount',
        'start_date',
        'target_date',
        'priority',
        'color',
        'is_active',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'target_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'progress_percentage',
        'remaining_amount',
        'days_remaining',
        'monthly_savings_needed',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(GoalProgress::class, 'financial_goal_id');
    }

    public function getProgressPercentageAttribute(): float
    {
        if ($this->target_amount == 0) {
            return 0;
        }
        return round(($this->current_amount / $this->target_amount) * 100, 2);
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, (float) ($this->target_amount - $this->current_amount));
    }

    public function getDaysRemainingAttribute(): int
    {
        return max(0, now()->diffInDays($this->target_date));
    }

    public function getMonthlySavingsNeededAttribute(): float
    {
        $monthsRemaining = max(1, (int) now()->diffInMonths($this->target_date));
        return round((float) ($this->remaining_amount / $monthsRemaining), 2);
    }

    public function getStatusAttribute(): string
    {
        if ($this->current_amount >= $this->target_amount) {
            return 'completed';
        }
        if ($this->target_date < now()) {
            return 'overdue';
        }
        $percentageCompletion = ($this->current_amount / $this->target_amount) * 100;
        $timeElapsed = $this->start_date->diffInDays(now());
        $totalTime = $this->start_date->diffInDays($this->target_date);
        $expectedCompletion = ($timeElapsed / max(1, $totalTime)) * 100;

        if ($percentageCompletion >= $expectedCompletion * 0.8) {
            return 'on_track';
        }
        return 'at_risk';
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('goal_type', $type);
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
