<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'report_type' => $this->report_type,
            'format' => $this->format,
            'data' => $this->data,
            'generated_at' => $this->generated_at?->toIso8601String(),
            'file_path' => $this->file_path,
            'file_url' => $this->file_path ? url('storage/' . $this->file_path) : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
