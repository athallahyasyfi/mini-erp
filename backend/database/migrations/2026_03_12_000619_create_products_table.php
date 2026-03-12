<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
        $table->id();                                    // kolom id otomatis
        $table->string('code')->unique();                // kode produk, harus unik
        $table->string('name');                          // nama produk
        $table->text('description')->nullable();         // deskripsi, boleh kosong
        $table->string('category')->nullable();          // kategori, boleh kosong
        $table->decimal('price', 15, 2)->default(0);    // harga, max 15 digit, 2 desimal
        $table->integer('stock')->default(0);            // stok
        $table->string('unit')->default('pcs');          // satuan (pcs, kg, dll)
        $table->timestamps();                            // created_at dan updated_at otomatis
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
