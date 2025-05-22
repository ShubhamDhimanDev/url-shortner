<?php

namespace App\Providers;

use App\Models\Url;
use App\Observers\UrlObserver;
use App\Services\IpWhoisService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('ipwhois', function () {
            return new IpWhoisService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Url::observe(UrlObserver::class);
        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($notifiable->getEmailForPasswordReset());
        });
    }
}
