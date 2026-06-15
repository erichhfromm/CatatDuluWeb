<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->transaction->user_id;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999.99'],
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
}
