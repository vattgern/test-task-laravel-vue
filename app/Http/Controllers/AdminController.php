<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Index', [
            'title' => 'Админ-панель'
        ]);
    }

    public function login()
    {
        return Inertia::render('Admin/Login', [
            'title' => "Вход"
        ]);
    }

    public function products()
    {
        return Inertia::render('Admin/Products/Index', [
            'title' => 'Товары'
        ]);
    }

    public function productCreate()
    {
        return Inertia::render('Admin/Products/Create', [
            'title' => 'Создание товара'
        ]);
    }

    public function productEdit(string $id)
    {
        if (!is_numeric($id))
            return abort(404);

        return Inertia::render('Admin/Products/Edit', [
            'title' => 'Редактирование товара №' . $id,
            'product'   => (int) $id
        ]);
    }
}
