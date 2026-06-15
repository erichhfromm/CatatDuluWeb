<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Support\CatatDuluData;

class RealtimeController extends Controller
{
    public function poll(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $unreadCount = $user->notifications()->where('is_read', false)->count();

        return response()->json([
            'balance' => $user->total_balance,
            'balance_formatted' => CatatDuluData::formatIDR($user->total_balance),
            'unread_notifications' => $unreadCount,
        ]);
    }
}
