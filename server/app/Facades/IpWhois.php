<?php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class IpWhois extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'ipwhois';
    }
}
