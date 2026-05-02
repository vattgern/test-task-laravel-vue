<?php

namespace App\Http\Requests\Product;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'          => ['filled', 'string', 'max:255'],
            'description'   => ['filled', 'string', 'max:1000'],
            'price'         => ['filled', 'numeric', 'min:1', 'max:9999999'],
            'category_id'   => ['filled', 'numeric', 'exists:categories,id']
        ];
    }
}
