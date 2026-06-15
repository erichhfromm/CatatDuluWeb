<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function generate(Request $request)
    {
        return redirect()->route('catatdulu.screen', [
            'screen' => 'reports',
            'start' => $request->start_date,
            'end' => $request->end_date,
            'type' => $request->type
        ]);
    }
    
    public function exportExcel(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = $user->transactions()->with('category')->orderBy('transaction_date', 'asc');
        
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('transaction_date', [
                $request->start_date,
                $request->end_date
            ]);
        }
        
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        
        $transactions = $query->get();
        $csv = "Tanggal,Kategori,Tipe,Nominal,Catatan\n";
        foreach($transactions as $t) {
            $cat = $t->category ? $t->category->name : 'Lainnya';
            $date = $t->transaction_date ? $t->transaction_date->format('Y-m-d') : '';
            $csv .= "{$date},{$cat},{$t->type},{$t->amount},{$t->description}\n";
        }
        
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="laporan_keuangan.csv"');
    }
}
