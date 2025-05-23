<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UrlVisits extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'short_url_id',
        'visiter_ip_address',
        'country',
        'country_flag',
        'city',
        'referrer',
        'device_type',
        'browser',
        'os',
        'visited_at'
    ];
}
