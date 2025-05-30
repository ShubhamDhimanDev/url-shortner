<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UrlController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;



Route::controller(AuthController::class)->group(function(){
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/send-reset-password-link',  'sendResetPasswordLink');
    Route::post('/reset-password', 'resetPassword')->name('password.reset');
});

Route::post('/get-long-url/{shortUrl}', [UrlController::class , 'getLongUrl']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware('signed')->name('verification.verify');

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::controller(AuthController::class)->group(function(){
        Route::post('/logout',  'logout');
        Route::post('/send-email-verification', 'sendEmailVerification');
    });

    Route::controller(UrlController::class)->group(function(){
        Route::post('/generate-short-url', 'generateShortUrl');
        Route::get('/get-url-list', 'getUrlList');
        Route::delete('delete-short-url/{shortUrl}', 'deleteShortUrl');
        Route::get('/get-analytics/{shortUrl}', 'getAnalytics');
        Route::get('/get-analytics/{shortUrl}/monthly', 'getMonthlyAnalytics');
    });

});
