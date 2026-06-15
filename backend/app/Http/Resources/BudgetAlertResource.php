<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetAlertResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'budget_id' => $this->budget_id,
            'alert_type' => $this->alert_type,
            'threshold_percentage' => $this->threshold_percentage,
            'is_triggered' => $this->is_triggered,
            'triggered_at' => $this->triggered_at?->toIso8601String(),
            'message' => $this->message,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
