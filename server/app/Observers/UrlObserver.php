<?php

namespace App\Observers;

use App\Models\Url;
use Illuminate\Support\Str;

class UrlObserver
{
    /**
     * Handle the Url "creating" event.
     */
    public function creating(Url $url): void
    {
        if (empty($url->short_url)) {
            $url->short_url = $this->generateUniqueShortUrl();
        }
    }

    /**
     * Handle the Url "created" event.
     */
    public function created(Url $url): void
    {
        //
    }

    /**
     * Handle the Url "updated" event.
     */
    public function updated(Url $url): void
    {
        //
    }

    /**
     * Handle the Url "deleted" event.
     */
    public function deleted(Url $url): void
    {
        //
    }

    /**
     * Handle the Url "restored" event.
     */
    public function restored(Url $url): void
    {
        //
    }

    /**
     * Handle the Url "force deleted" event.
     */
    public function forceDeleted(Url $url): void
    {
        //
    }

    /**
     * Generate a unique short URL.
     *
     * @return string
     */
    private function generateUniqueShortUrl()
    {
        $length = 8;
        do {
            $shortUrl = Str::random($length);
        } while (Url::where('short_url', $shortUrl)->exists());

        return $shortUrl;
    }
}
