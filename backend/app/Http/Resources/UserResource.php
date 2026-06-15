<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'currency' => $this->currency,
            'date_format' => $this->date_format,
            'theme' => $this->theme,
            'is_active' => $this->is_active,
            'subscription_type' => $this->subscription_type,
            'subscription_until' => $this->subscription_until?->toIso8601String(),
            'profile_picture' => $this->profile_picture,
            'bio' => $this->bio,
            'total_balance' => (float) $this->total_balance,
            'monthly_expense' => (float) $this->monthly_expense,
            'monthly_income' => (float) $this->monthly_income,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
