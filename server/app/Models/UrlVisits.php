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
        'visited_at'
    ];
}
