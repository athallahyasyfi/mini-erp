<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /products — ambil semua produk (dengan pagination dan search)
    public function index(Request $request)
    {
        $query = Product::query();

        // Jika ada parameter search di URL
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            });
        }

        // Pagination: gunakan per_page dari request, default 15
        $perPage = $request->per_page ?? 15;
        return response()->json($query->latest()->paginate($perPage));
    }

    // POST /products — buat produk baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'        => 'required|unique:products',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'unit'        => 'required|string',
        ]);

        $product = Product::create($validated);

        // 201 = HTTP status "Created"
        return response()->json($product, 201);
    }

    // GET /products/{id} — ambil satu produk
    public function show(Product $product)
    {
        return response()->json($product);
    }

    // PUT /products/{id} — update produk
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            // unique tapi kecualikan id produk ini sendiri
            'code'        => 'required|unique:products,code,' . $product->id,
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'unit'        => 'required|string',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    // DELETE /products/{id} — hapus produk
    public function destroy(Product $product)
    {
        $product->delete();
        // 204 = "No Content", sukses tapi tidak ada data yang dikembalikan
        return response()->json(null, 204);
    }
}
