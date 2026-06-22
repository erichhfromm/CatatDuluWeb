<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999999.99'],
            'type' => ['required', 'in:income,expense'],
            'description' => ['required', 'string', 'min:3', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'transaction_date' => ['required', 'date_format:Y-m-d H:i:s'],
            'payment_method' => ['required', 'string', 'in:cash,card,bank,wallet,other'],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'max:50'],
            'recurring' => ['boolean'],
            'recurring_frequency' => ['nullable', 'in:daily,weekly,monthly,yearly'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'amount.required' => 'Amount is required',
            'amount.numeric' => 'Amount must be a number',
            'amount.min' => 'Amount must be greater than 0',
            'type.required' => 'Transaction type is required',
            'type.in' => 'Transaction type must be either income or expense',
            'description.required' => 'Description is required',
            'transaction_date.required' => 'Transaction date is required',
            'payment_method.required' => 'Payment method is required',
        ];
    }
}
