<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\Product\IndexResource;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index(Request $request)
    {

        if ($request->category_id && !is_numeric($request->category_id))
            return response()->json(['message' => 'Параметр некорректен'], 400);

        $products = Product::with('category')
            ->when($request->category_id, function ($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->paginate($request->per_page ?? 15)
            ->withQueryString();

        return new ProductCollection($products);
    }

    public function store(StoreRequest $request)
    {
        $product = Product::create($request->validated());

        return (new ProductResource($product->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id)
    {
        try {
            if (!is_numeric($id))
                return response()->json(['message' => 'Параметр некорректен'], 400);

            $product = Product::find($id);
            if (!$product)
                return response()->json(['message' => 'Запись не найдена'], 404);

            return new IndexResource($product->load('category'));
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => 'Server error'
            ], 500);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        if (!is_numeric($id))
            return response()->json(['message'  => 'Параметр некорректен'], 400);

        $product = Product::find($id);
        if (!$product)
            return response()->json(['message' => 'Запись не найдена'], 404);

        $product->update($request->validated());
        return new ProductResource($product->load('category'));
    }

    public function destroy(string $id)
    {
        try {
            if (!is_numeric($id))
                return response()->json(['message' => 'Параметр некорректен'], 400);
            $product = Product::find($id);
            if (!$product)
                return response()->json(['message' => 'Запись не найдена'], 404);

            $product->delete();
            return response()->json([
                'message'   => 'Товар удален'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => 'Server error'
            ], $e->getCode());
        }
    }
}
