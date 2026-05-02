<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/',                         [PageController::class, 'index']);
Route::get('/product/{id}',             [PageController::class, 'product']);

Route::get('/admin/products',           [AdminController::class, 'products']);
Route::get('/admin/products/create',    [AdminController::class, 'productCreate']);
Route::get('/admin/login',              [AdminController::class, 'login']);
Route::get('/admin',                    [AdminController::class, 'index']);
