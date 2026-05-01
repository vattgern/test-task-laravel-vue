<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CategoryListController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('products', ProductController::class);
Route::get('categories', CategoryListController::class);
Route::post('login', LoginController::class);
