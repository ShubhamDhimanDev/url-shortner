<?php

namespace App\Http\Controllers;

use App\Models\Url;
use App\Models\UrlVisits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class UrlController extends Controller
{
    public function generateShortUrl(Request $request)
    {
        $validator = Validator::make($request->only('url'),[
            'url' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'errors' => ['url'=>[$validator->errors()->all()]]
            ], 422);
        }

        $url = Url::create([
            'long_url' => $request->url,
            'user_id' => Auth::id()
        ]);

        $qrCodeContent = QrCode::format('svg')->size(200)->generate(url($url->short_url));
        $publicPath = public_path('qrcodes');

        // Ensure the directory exists
        if (!File::exists($publicPath)) {
            File::makeDirectory($publicPath, 0755, true);
        }

        // Define the file path within the public directory
        $fileName = $url->short_url . '.svg';
        $filePath = $publicPath . '/' . $fileName;

        // Save the QR code to the file
        File::put($filePath, $qrCodeContent);

        return response()->json([
            'url' => $url->short_url,
            'qrcode' => asset('qrcodes/' . $fileName)
        ]);

    }

    public function getLongUrl(Request $request, $shortUrl)
    {
        $url = Url::where('short_url', $shortUrl)->first();
        if(!$url){

            return response()->json([
                'errors' => ['url' => ['URL not found']]
            ], 404);
        }

        UrlVisits::create([
            'short_url_id' => $url->id,
            'visiter_ip_address' => $request->ip(),
        ]);

        return response()->json([
            'url' => $url->long_url
        ]);
    }

    public function getUrlList(Request $request)
    {
        $urls = Url::where('user_id', Auth::id())->paginate(5);

        return response()->json($urls);
    }

    public function deleteShortUrl(Request $request, $shortUrl)
    {
        $shortUrl = Url::where('short_url', $shortUrl)->first();
        if($shortUrl !== null && $shortUrl->user_id !== Auth::id()){
            return response()->json([
                'errors' => ['permission' => 'unauthorized']
            ],403);
        }

        $filePath = public_path('qrcodes/'.$shortUrl->short_url.'.png');
        if(File::exists($filePath)){
            File::delete($filePath);
        }
        $shortUrl->delete();

        return response()->json([
            'success' => true,
            'message' => 'URL Deleted Successfully'
        ], 200);
    }
}
