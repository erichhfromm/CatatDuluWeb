<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'goal_type' => $this->goal_type,
            'target_amount' => (float) $this->target_amount,
            'current_amount' => (float) $this->current_amount,
            'start_date' => $this->start_date?->toIso8601String(),
            'target_date' => $this->target_date?->toIso8601String(),
            'priority' => $this->priority,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'progress_percentage' => $this->progress_percentage,
            'remaining_amount' => (float) $this->remaining_amount,
            'days_remaining' => $this->days_remaining,
            'monthly_savings_needed' => (float) $this->monthly_savings_needed,
            'status' => $this->status,
            'progress' => GoalProgressResource::collection($this->whenLoaded('progress')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
