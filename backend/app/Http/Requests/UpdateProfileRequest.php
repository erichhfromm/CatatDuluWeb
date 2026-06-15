<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = auth()->user()->id;

        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'email', "unique:users,email,{$userId}"],
            'phone' => ['nullable', 'string', 'regex:/^\+?[1-9]\d{1,14}$/'],
            'bio' => ['nullable', 'string', 'max:500'],
            'currency' => ['required', 'string', 'size:3'],
            'date_format' => ['required', 'string'],
            'theme' => ['required', 'in:light,dark'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.unique' => 'Email already in use',
            'phone.regex' => 'Invalid phone number format',
            'currency.required' => 'Currency is required',
            'currency.size' => 'Currency code must be 3 characters',
        ];
    }
}
