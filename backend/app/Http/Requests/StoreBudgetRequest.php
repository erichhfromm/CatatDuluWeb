<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
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
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999999.99'],
            'period' => ['required', 'in:daily,weekly,monthly,quarterly,yearly'],
            'start_date' => ['required', 'date_format:Y-m-d H:i:s'],
            'end_date' => ['required', 'date_format:Y-m-d H:i:s', 'after:start_date'],
            'is_active' => ['boolean'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
            'categories' => ['nullable', 'array'],
            'categories.*.category_id' => ['integer', 'exists:categories,id'],
            'categories.*.allocated_amount' => ['numeric', 'min:0.01'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Budget name is required',
            'amount.required' => 'Budget amount is required',
            'period.required' => 'Budget period is required',
            'end_date.after' => 'End date must be after start date',
        ];
    }
}
