<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\UpsertTransactionRequest;
use App\Models\Category;
use App\Models\Transaction;
use App\Events\TransactionAdded;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    use AuthorizesRequests;
    public function store(UpsertTransactionRequest $request): RedirectResponse
    {
        $this->createTransaction($request);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        TransactionAdded::dispatch($user, $user->total_balance, 'Transaksi berhasil ditambahkan.');

        return $this->redirectAfterSave($request->type, 'Transaksi berhasil ditambahkan.');
    }

    public function update(UpsertTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $this->authorize('update', $transaction);

        $this->persistTransaction($request, $transaction);

        return redirect()
            ->route('catatdulu.screen', ['screen' => 'transaction-detail', 'id' => $transaction->id])
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        $type = $transaction->type;
        $transaction->delete();

        /** @var \App\Models\User $user */
        $user = Auth::user();
        TransactionAdded::dispatch($user, $user->total_balance, 'Transaksi berhasil dihapus.');

        return $this->redirectAfterSave($type, 'Transaksi berhasil dihapus.');
    }

    private function createTransaction(UpsertTransactionRequest $request): Transaction
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $category = $this->resolveCategory($user->id, $request);

        return $user->transactions()->create(
            $this->transactionAttributes($request, $category->id)
        );
    }

    private function persistTransaction(UpsertTransactionRequest $request, Transaction $transaction): void
    {
        $category = $this->resolveCategory($transaction->user_id, $request);

        $transaction->update(
            $this->transactionAttributes($request, $category->id)
        );
    }

    private function resolveCategory(int $userId, UpsertTransactionRequest $request): Category
    {
        return Category::firstOrCreate(
            ['name' => $request->category_name, 'user_id' => $userId],
            [
                'type' => $request->type,
                'slug' => Str::slug($request->category_name),
                'is_custom' => true,
            ]
        );
    }

    private function transactionAttributes(UpsertTransactionRequest $request, int $categoryId): array
    {
        $description = trim((string) ($request->notes ?: $request->category_name));

        return [
            'category_id' => $categoryId,
            'amount' => $request->amount,
            'type' => $request->type,
            'payment_method' => $request->payment_method,
            'transaction_date' => $request->transaction_date,
            'notes' => $request->notes,
            'description' => $description,
        ];
    }

    private function redirectAfterSave(string $type, string $message): RedirectResponse
    {
        $screen = $type === 'income' ? 'income' : 'expense';

        return redirect()
            ->route('catatdulu.screen', ['screen' => $screen])
            ->with('success', $message);
    }
}
