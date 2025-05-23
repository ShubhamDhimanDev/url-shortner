<?php

namespace App\Http\Controllers;

use App\Facades\IpWhois;
use App\Models\Url;
use App\Models\UrlVisits;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class UrlController extends Controller
{
    public function generateShortUrl(Request $request)
    {
        $validator = Validator::make($request->only('url'), [
            'url' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => ['url' => [$validator->errors()->all()]]
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
        if (!$url) {

            return response()->json([
                'errors' => ['url' => ['URL not found']]
            ], 404);
        }

        $geoLocation = IpWhois::lookup($request->ip());

        UrlVisits::create([
            'short_url_id'        => $url->id,
            'visiter_ip_address'  => $request->ip(),
            'country'             => $geoLocation['country']      ?? null,
            'country_flag'        => $geoLocation['country_flag'] ?? null,
            'city'                => $geoLocation['city']         ?? null,
            'referrer'            => $request->input('referrer'),
            'device_type'         => $request->input('device_type'),
            'browser'             => $request->input('browser'),
            'os'                  => $request->input('os'),
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
        if ($shortUrl !== null && $shortUrl->user_id !== Auth::id()) {
            return response()->json([
                'errors' => ['permission' => 'unauthorized']
            ], 403);
        }

        $filePath = public_path('qrcodes/' . $shortUrl->short_url . '.svg');
        if (File::exists($filePath)) {
            File::delete($filePath);
        }
        $shortUrl->delete();

        return response()->json([
            'success' => true,
            'message' => 'URL Deleted Successfully'
        ], 200);
    }

    public function getAnalytics(Request $request, $shortUrl)
    {
        $shortUrl = Url::with('urlVisits')->where('short_url', $shortUrl)->first();

        if ($shortUrl === null) {
            return response()->json([
                'errors' => ['message' => 'Url not found']
            ], 404);
        }
        if ($shortUrl !== null && $shortUrl->user_id !== Auth::id()) {
            return response()->json([
                'errors' => ['message' => 'unauthorized']
            ], 403);
        }

        $visits         = $shortUrl->urlVisits;
        $totalVisits    = $visits->count();
        $uniqueVisits   = $visits->unique('visiter_ip_address')->count();
        $countryCounts  = $visits->pluck('country')->filter()->countBy();
        $referrerCounts = $visits->pluck('referrer')->filter()->countBy();
        $deviceCounts   = $visits->pluck('device_type')->filter()->countBy();
        $browserCounts  = $visits->pluck('browser')->filter()->countBy();
        $osCounts       = $visits->pluck('os')->filter()->countBy();

        return response()->json([
            'total'      => $totalVisits,
            'unique'     => $uniqueVisits,
            'by_country' => $countryCounts,
            'by_referrer' => $referrerCounts,
            'by_device'  => $deviceCounts,
            'by_browser' => $browserCounts,
            'by_os'      => $osCounts,
        ]);
    }

    public function getMonthlyAnalytics(Request $request, $shortUrl)
    {
        // 1) Lookup & authorize
        $url = Url::where('short_url', $shortUrl)->first();
        if (! $url) {
            return response()->json(['errors' => ['message' => 'URL not found']], 404);
        }
        if ($url->user_id !== Auth::id()) {
            return response()->json(['errors' => ['message' => 'Unauthorized']], 403);
        }

        // 2) Determine period boundaries
        $period = $request->query('period', 'last_6_months');
        $now    = Carbon::now();
        switch ($period) {
            case 'this_year':
                $start = $now->copy()->startOfYear();
                $end   = $now->copy()->endOfYear();
                break;
            case 'last_year':
                $start = $now->copy()->subYear()->startOfYear();
                $end   = $now->copy()->subYear()->endOfYear();
                break;
            case 'last_6_months':
            default:
                // last 6 including this month
                $start = $now->copy()->subMonths(5)->startOfMonth();
                $end   = $now->copy()->endOfMonth();
                break;
        }

        // 3) Aggregate by YYYY‑MM
        $rows = UrlVisits::select(
                    DB::raw("DATE_FORMAT(visited_at, '%Y-%m') as ym"),
                    DB::raw('count(*) as count')
                )
                ->where('short_url_id', $url->id)
                ->whereBetween('visited_at', [$start, $end])
                ->groupBy('ym')
                ->orderBy('ym')
                ->get();

        // 4) (Optional) fill in missing months with zero
        $periodRange = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $periodRange[$cursor->format('Y-m')] = 0;
            $cursor->addMonth();
        }
        foreach ($rows as $r) {
            $periodRange[$r->ym] = (int) $r->count;
        }

        // 5) Reformat to [{ month: 'Apr 2025', count: 123 }, …]
        $monthly = collect($periodRange)
            ->map(function($cnt, $ym) {
                $label = Carbon::createFromFormat('Y-m', $ym)->format('M Y');
                return ['month' => $label, 'count' => $cnt];
            })
            ->values();

        return response()->json([
            'monthly' => $monthly,
        ]);
    }
}
