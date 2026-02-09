<?php

namespace App\Http\Middleware;

use Closure;

class SetCacheControlHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        $response->header('Pragma', 'no-cache');
        $response->header('Expires', '0');

        return $response;
    }
}
