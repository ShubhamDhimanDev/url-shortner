<?php

use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    dd($request, $request->ip());
    return view('welcome');
});

Route::get('/send-test-email', [TestController::class, 'sendTestEmail']);
