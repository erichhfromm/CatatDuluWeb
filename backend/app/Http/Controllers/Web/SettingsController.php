<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'date_format' => 'nullable|string',
            'theme' => 'nullable|string',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update($request->only(['date_format', 'theme']));
        
        return back()->with('success', 'Preferensi berhasil disimpan.');
    }

    public function deleteAccount(Request $request)
    {
        /** @var \App\Models\User $user */
        Auth::logout();
        $user->delete();
        
        return redirect()->route('catatdulu.home')->with('success', 'Akun berhasil dihapus.');
    }
}
