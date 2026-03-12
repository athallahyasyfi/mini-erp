<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id', 'product_id', 'quantity', 'price', 'subtotal'
    ];

    // Relasi: satu item merujuk ke satu produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
