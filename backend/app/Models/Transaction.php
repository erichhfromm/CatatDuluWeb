<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'amount',
        'type',
        'description',
        'notes',
        'transaction_date',
        'payment_method',
        'tags',
        'recurring',
        'recurring_frequency',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'recurring' => 'boolean',
        'transaction_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'tags' => 'array',
    ];

    protected $appends = [
        'formatted_amount',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TransactionAttachment::class);
    }

    public function getFormattedAmountAttribute(): string
    {
        $symbol = $this->user->currency ?? '$';
        $sign = $this->type === 'income' ? '+' : '-';
        return "{$sign}{$symbol}" . number_format($this->amount, 2);
    }

    public function getStatusAttribute(): string
    {
        return $this->transaction_date->isPast() ? 'completed' : 'pending';
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecurring($query)
    {
        return $query->where('recurring', true);
    }

    public function scopeDateRange($query, \DateTime $from, \DateTime $to)
    {
        return $query->whereBetween('transaction_date', [$from, $to]);
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByPaymentMethod($query, string $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeRecent($query, int $limit = 10)
    {
        return $query->orderBy('transaction_date', 'desc')->limit($limit);
    }

    public function scopeWithTags($query, array $tags)
    {
        return $query->whereJsonContains('tags', $tags);
    }
}
