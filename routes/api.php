<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\CategoryListController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('categories', CategoryListController::class);
Route::post('login', LoginController::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('logout', LogoutController::class);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
});
