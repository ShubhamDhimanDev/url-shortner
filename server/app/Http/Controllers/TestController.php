<?php

namespace App\Http\Controllers;

use App\Mail\TestEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TestController extends Controller
{
    public function sendTestEmail(Request $request){
         Mail::to('rockonshubh@gmail.com')->send(new TestEmail());

        return response()->json(['message' => 'Test email sent to rockonshubh@gmail.com']);
    }
}
