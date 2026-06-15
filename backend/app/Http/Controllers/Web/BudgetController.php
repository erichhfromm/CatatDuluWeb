<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'period' => 'required|string',
            'color' => 'nullable|string',
        ]);

        $user = Auth::user();

        $user->budgets()->create([
            'name' => $request->name,
            'amount' => $request->amount,
            'period' => $request->period,
            'color' => $request->color ?? '#3B82F6',
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'is_active' => true,
        ]);

        return back();
    }
}
