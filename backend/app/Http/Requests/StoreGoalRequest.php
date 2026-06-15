<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'goal_type' => ['required', 'string', 'min:2', 'max:100'],
            'target_amount' => ['required', 'numeric', 'min:0.01', 'max:999999.99'],
            'start_date' => ['required', 'date_format:Y-m-d H:i:s'],
            'target_date' => ['required', 'date_format:Y-m-d H:i:s', 'after:start_date'],
            'priority' => ['required', 'in:low,medium,high'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Goal name is required',
            'target_amount.required' => 'Target amount is required',
            'goal_type.required' => 'Goal type is required',
            'priority.required' => 'Priority is required',
            'target_date.after' => 'Target date must be after start date',
        ];
    }
}
