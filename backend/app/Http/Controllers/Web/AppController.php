<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\CatatDuluViewData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AppController extends Controller
{
    public function __construct(private CatatDuluViewData $viewData) {}

    public function show(Request $request, ?string $screen = null): View|RedirectResponse
    {
        $screen = $screen ?: 'splash';

        $publicScreens = ['splash', 'login', 'register', 'empty', 'error'];
        $isLoggedIn = Auth::check();

        if (!$isLoggedIn && !in_array($screen, $publicScreens)) {
            return redirect()->route('catatdulu.screen', ['screen' => 'login']);
        }

        if ($isLoggedIn && in_array($screen, ['splash', 'login', 'register'])) {
            return redirect()->route('catatdulu.screen', ['screen' => 'dashboard']);
        }

        $user = Auth::user();
        $data = $isLoggedIn
            ? $this->viewData->forUser($user, $request)
            : $this->viewData->forGuest();

        $selectedTransaction = null;
        $categories = ['income' => [], 'expense' => []];

        if ($isLoggedIn) {
            $categories = [
                'income' => Category::query()
                    ->where('user_id', $user->id)
                    ->where('type', 'income')
                    ->orderBy('name')
                    ->pluck('name')
                    ->all(),
                'expense' => Category::query()
                    ->where('user_id', $user->id)
                    ->where('type', 'expense')
                    ->orderBy('name')
                    ->pluck('name')
                    ->all(),
            ];

            if ($screen === 'transaction-detail') {
                if (!$request->filled('id')) {
                    $detailRedirect = $this->resolveTransactionDetail($request, $data['transactions']);
                    if ($detailRedirect) {
                        return $detailRedirect;
                    }
                } else {
                    $transaction = $user->transactions()
                        ->with('category')
                        ->find($request->integer('id'));

                    if (!$transaction) {
                        return redirect()
                            ->route('catatdulu.screen', ['screen' => 'expense'])
                            ->with('error', 'Transaksi tidak ditemukan.');
                    }

                    $selectedTransaction = CatatDuluViewData::mapTransactionRow($transaction);
                }
            }
        }

        return view('catatdulu.app', [
            'screen' => $screen,
            'data' => $data,
            'user' => $user,
            'currentMonthLabel' => CatatDuluViewData::currentMonthLabel(),
            'selectedTransaction' => $selectedTransaction,
            'categories' => $categories,
        ]);
    }

    private function resolveTransactionDetail(Request $request, array $transactions): ?RedirectResponse
    {
        if ($request->filled('id')) {
            return null;
        }

        if (count($transactions) === 0) {
            return redirect()
                ->route('catatdulu.screen', ['screen' => 'expense'])
                ->with('error', 'Belum ada transaksi untuk ditampilkan.');
        }

        return redirect()->route('catatdulu.screen', [
            'screen' => 'transaction-detail',
            'id' => $transactions[0]['db_id'],
        ]);
    }
}
