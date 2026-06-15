<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoalProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'financial_goal_id',
        'amount',
        'notes',
        'recorded_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'recorded_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function goal(): BelongsTo
    {
        return $this->belongsTo(FinancialGoal::class, 'financial_goal_id');
    }

    public function scopeForGoal($query, int $goalId)
    {
        return $query->where('financial_goal_id', $goalId);
    }

    public function scopeRecent($query, int $limit = 10)
    {
        return $query->orderBy('recorded_date', 'desc')->limit($limit);
    }
}
