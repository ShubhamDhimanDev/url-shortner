<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UrlController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;



Route::controller(AuthController::class)->group(function(){
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/send-reset-password-link',  'sendResetPasswordLink');
    Route::post('/reset-password', 'resetPassword')->name('password.reset');
});

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::controller(AuthController::class)->group(function(){
        Route::post('/logout',  'logout');
        Route::post('/send-email-verification', 'sendEmailVerification');
        Route::get('/email/verify/{id}/{hash}', 'verifyEmail')->middleware('signed')->name('verification.verify');
    });

    Route::controller(UrlController::class)->group(function(){
        Route::post('/generate-short-url', 'generateShortUrl');
        Route::post('/get-long-url/{shortUrl}', 'getLongUrl');
        Route::get('/get-url-list', 'getUrlList');
        Route::delete('delete-short-url/{shortUrl}', 'deleteShortUrl');
    });

});
