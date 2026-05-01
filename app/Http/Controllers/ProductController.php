<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Override;

class ProductController extends Controller implements HasMiddleware
{
    #[Override]
    public static function middleware()
    {
        return [
            // 'auth:sanctum'  => [
            //     'except'    => ['index', 'show']
            // ]
        ];
    }

    public function index(Request $request)
    {
        $products = Product::with('category')
            ->paginate($request->per_page ?? 15);

        return new ProductCollection($products);
    }

    public function store(StoreRequest $request)
    {
        $product = Product::create($request->validated());

        return (new ProductResource($product->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    public function update(UpdateRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json([
            'message'   => 'Товар удален'
        ]);
    }
}
