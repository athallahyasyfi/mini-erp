<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number', 'customer_id', 'date',
        'total', 'status', 'notes'
    ];

    protected $casts = [
        'date' => 'date', // agar otomatis jadi object tanggal
    ];

    // Relasi: satu sale punya satu customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi: satu sale punya banyak items
    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
