<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Kolom mana saja yang boleh diisi via mass assignment
    protected $fillable = [
        'code', 'name', 'description', 'category',
        'price', 'stock', 'unit'
    ];
}
