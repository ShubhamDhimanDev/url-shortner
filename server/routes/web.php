<?php

use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    dd($request, $request->ip());
    return view('welcome');
});

Route::prefix('/test')->controller(TestController::class)->group(function(){
    Route::get('/send-test-email', 'sendTestEmail');
    Route::get('/ip-location', 'ipLocation');
});
