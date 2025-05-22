<?php

namespace App\Http\Controllers;

use App\Mail\TestEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Facades\IpWhois;

class TestController extends Controller
{
    public function sendTestEmail(Request $request){
         Mail::to('rockonshubh@gmail.com')->send(new TestEmail());

        return response()->json(['message' => 'Test email sent to rockonshubh@gmail.com']);
    }

    public function ipLocation(Request $request){
        $ip = '122.176.207.247';
        $info = IpWhois::lookup($ip);
        echo $info['country'];
        echo "<img src='".$info['country_flag']."'>";
        dd($info);
    }
}
