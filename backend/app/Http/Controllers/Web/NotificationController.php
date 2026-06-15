<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function markAllAsRead()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->notifications()->update(['is_read' => true]);
        
        return back()->with('success', 'Semua notifikasi telah ditandai sudah dibaca.');
    }
}
