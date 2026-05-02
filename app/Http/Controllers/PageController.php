<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render('Index', [
            'title' => 'Главная'
        ]);
    }

    public function product(string $id)
    {
        if (!is_numeric($id))
            return abort(404);

        return Inertia::render('Product/Index', [
            'title'     => sprintf("Товар №%s", $id),
            'product'   => (int) $id
        ]);
    }
}
