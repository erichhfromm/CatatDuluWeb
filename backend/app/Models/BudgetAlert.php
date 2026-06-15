<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'alert_type',
        'threshold_percentage',
        'is_triggered',
        'triggered_at',
        'message',
    ];

    protected $casts = [
        'is_triggered' => 'boolean',
        'triggered_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    public function trigger(): void
    {
        $this->update([
            'is_triggered' => true,
            'triggered_at' => now(),
        ]);

        Notification::create([
            'user_id' => $this->budget->user_id,
            'title' => 'Budget Alert',
            'message' => $this->message,
            'type' => 'budget_alert',
            'related_id' => $this->budget_id,
            'related_type' => 'Budget',
        ]);
    }

    public function scopeActive($query)
    {
        return $query->where('is_triggered', false);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('alert_type', $type);
    }
}
