<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class IndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'description'   => $this->description,
            // 'price'         => Number::currency($this->price, 'RUB', 'ru_RU'),
            'price'         => $this->price,
            'category'      => [
                'id'        => $this->category->id,
                'name'      => $this->category->name,
            ],
            'created_at'    => $this->created_at->format('Y.m.d H:i:s'),
            'updated_at'    => $this->updated_at->format('Y.m.d H:i:s')
        ];
    }
}
