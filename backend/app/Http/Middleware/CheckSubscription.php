<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->subscription_type !== 'premium' && $user->subscription_until && $user->subscription_until < now()) {
            return response()->json([
                'message' => 'Subscription has expired',
                'error' => 'subscription_expired',
                'subscription_until' => $user->subscription_until,
            ], 403);
        }

        return $next($request);
    }
}
