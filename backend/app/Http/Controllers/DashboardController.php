<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_revenue' => Sale::where('status', 'completed')
                ->whereMonth('date', now()->month)
                ->sum('total'),

            'total_orders' => Sale::whereMonth('date', now()->month)->count(),

            'total_products'  => Product::count(),
            'low_stock'       => Product::where('stock', '<', 10)->count(),
            'total_customers' => Customer::count(),

            'sales_chart' => Sale::select(
                    DB::raw('DATE(date) as date'),
                    DB::raw('SUM(total) as total')
                )
                ->where('date', '>=', now()->subDays(6))
                ->where('status', 'completed')
                ->groupBy(DB::raw('DATE(date)'))
                ->orderBy('date')
                ->get(),

            'top_products' => DB::table('sale_items')
                ->join('products', 'sale_items.product_id', '=', 'products.id')
                ->select('products.name', DB::raw('SUM(sale_items.quantity) as total_qty'))
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_qty')
                ->limit(5)
                ->get(),
        ]);
    }
}
