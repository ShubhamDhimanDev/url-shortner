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
        Schema::table('url_visits', function (Blueprint $table) {
            $table->string('country')->nullable()->after('visiter_ip_address');
            $table->string('country_flag')->nullable()->after('country');
            $table->string('city')->nullable()->after('country_flag');
            $table->string('referrer')->nullable()->after('city');
            $table->string('device_type')->nullable()->after('referrer');
            $table->string('browser')->nullable()->after('device_type');
            $table->string('os')->nullable()->after('browser');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('url_visits', function (Blueprint $table) {
            $table->dropColumn([
                'country',
                'country_flag',
                'city',
                'referrer',
                'device_type',
                'browser',
                'os',
            ]);
        });
    }
};
