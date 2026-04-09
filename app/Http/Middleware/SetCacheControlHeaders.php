<?php

namespace App\Http\Middleware;

use Closure;

class SetCacheControlHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // Use Symfony's header bag (works for StreamedResponse, BinaryFileResponse, etc.)
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');

        return $response;
    }
}
