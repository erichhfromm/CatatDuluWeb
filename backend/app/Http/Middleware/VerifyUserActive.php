<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyUserActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->is_active) {
            return response()->json([
                'message' => 'User account is inactive',
                'error' => 'inactive_user',
            ], 403);
        }

        return $next($request);
    }
}
