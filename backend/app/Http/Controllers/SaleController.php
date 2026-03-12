<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with('customer')->orderBy('date', 'desc');

        if ($request->search) {
            $query->where('invoice_number', 'like', "%{$request->search}%")
                  ->orWhereHas('customer', fn($q) =>
                      $q->where('name', 'like', "%{$request->search}%")
                  );
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id'        => 'required|exists:customers,id',
            'date'               => 'required|date',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
            'notes'              => 'nullable|string',
        ]);

        // DB::transaction memastikan semua atau tidak ada yang tersimpan
        // Kalau di tengah jalan error, semua perubahan dibatalkan
        return DB::transaction(function () use ($request) {
            // Hitung total dari semua item
            $total = collect($request->items)
                ->sum(fn($i) => $i['quantity'] * $i['price']);

            // Generate nomor invoice otomatis: INV-20240101-0001
            $todayCount = Sale::whereDate('created_at', today())->count() + 1;
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad($todayCount, 4, '0', STR_PAD_LEFT);

            // Buat record sale
            $sale = Sale::create([
                'invoice_number' => $invoiceNumber,
                'customer_id'    => $request->customer_id,
                'date'           => $request->date,
                'total'          => $total,
                'status'         => 'completed',
                'notes'          => $request->notes,
            ]);

            // Buat item-item dan kurangi stok
            foreach ($request->items as $item) {
                $sale->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'subtotal'   => $item['quantity'] * $item['price'],
                ]);

                Product::find($item['product_id'])
                    ->decrement('stock', $item['quantity']);
            }

            // Kembalikan sale beserta relasi-relasinya
            return response()->json($sale->load('items.product', 'customer'), 201);
        });
    }

    public function show(Sale $sale)
    {
        return response()->json($sale->load('items.product', 'customer'));
    }
}
