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
        Schema::create('url_visits', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('short_url_id')->unsigned()->index();
            $table->foreign('short_url_id')->references('id')->on('urls')->onDelete('cascade');
            $table->string('visiter_ip_address');
            $table->timestamp('visited_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('url_visits');
    }
};
