<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'amount' => (float) $this->amount,
            'period' => $this->period,
            'start_date' => $this->start_date?->toIso8601String(),
            'end_date' => $this->end_date?->toIso8601String(),
            'is_active' => $this->is_active,
            'color' => $this->color,
            'spent_amount' => (float) $this->spent_amount,
            'remaining_amount' => (float) $this->remaining_amount,
            'percentage_used' => $this->percentage_used,
            'status' => $this->status,
            'categories' => BudgetCategoryResource::collection($this->whenLoaded('categories')),
            'alerts' => BudgetAlertResource::collection($this->whenLoaded('alerts')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
