<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'category_id',
        'allocated_amount',
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'spent_amount',
        'remaining_amount',
    ];

    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getSpentAmountAttribute(): float
    {
        return (float) $this->category->transactions()
            ->whereBetween('transaction_date', [
                $this->budget->start_date,
                $this->budget->end_date,
            ])
            ->sum('amount');
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, (float) ($this->allocated_amount - $this->spent_amount));
    }
}
