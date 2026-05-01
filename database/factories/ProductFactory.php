<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'      => fake()->jobTitle(),
            'description'   => fake()->realText(),
            'price'         => fake()->numberBetween(100, 25000),
            'category_id'   => fake()->numberBetween(1, 10)
        ];
    }
}
