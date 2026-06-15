<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'amount' => (float) $this->amount,
            'type' => $this->type,
            'description' => $this->description,
            'notes' => $this->notes,
            'transaction_date' => $this->transaction_date?->toIso8601String(),
            'payment_method' => $this->payment_method,
            'tags' => $this->tags,
            'recurring' => $this->recurring,
            'recurring_frequency' => $this->recurring_frequency,
            'status' => $this->status,
            'formatted_amount' => $this->formatted_amount,
            'attachments' => TransactionAttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
