<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class IpWhoisService
{
    protected string $baseUrl = 'https://ipwhois.app/json/';

    public function lookup(string $ip): ?array
    {
        try {
            $response = Http::timeout(5)->get($this->baseUrl . $ip);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            // Optionally log error
            return null;
        }
    }
}
