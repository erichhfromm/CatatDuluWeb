@php
    $paymentMethods = ['BCA', 'Mandiri', 'GoPay', 'Cash', 'OVO'];
    if (! in_array($t['account'], $paymentMethods, true)) {
        array_unshift($paymentMethods, $t['account']);
    }
    $categoryOptions = $categories[$t['type']] ?? [];
    if (! in_array($t['category'], $categoryOptions, true)) {
        array_unshift($categoryOptions, $t['category']);
    }
@endphp
<div id="tx-edit-modal" class="modal hidden fixed inset-0 z-50 items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <form method="POST" action="{{ route('catatdulu.transactions.update', $t['db_id']) }}" class="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        @csrf
        @method('PUT')
        <input type="hidden" name="type" value="{{ $t['type'] }}">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3>Edit Transaksi</h3>
            <button type="button" data-modal-close class="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">x</button>
        </div>
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
            <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">Nominal <span class="text-destructive">*</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                    <input type="number" name="amount" value="{{ old('amount', $t['amount']) }}" step="0.01" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm pl-10" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-foreground mb-1.5">Kategori</label>
                    <select name="category_name" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
                        @foreach ($categoryOptions as $categoryName)
                            <option value="{{ $categoryName }}" @selected(old('category_name', $t['category']) === $categoryName)>{{ $categoryName }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-foreground mb-1.5">Akun</label>
                    <select name="payment_method" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
                        @foreach ($paymentMethods as $method)
                            <option value="{{ $method }}" @selected(old('payment_method', $t['account']) === $method)>{{ $method }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">Tanggal</label>
                <input type="date" name="transaction_date" value="{{ old('transaction_date', $t['date']) }}" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" required>
            </div>
            <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">Catatan</label>
                <textarea name="notes" class="w-full min-h-[90px] p-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Tambahkan catatan opsional...">{{ old('notes', $t['note']) }}</textarea>
            </div>
        </div>
        <div class="px-6 py-4 border-t border-border flex justify-end gap-2">
            <button type="button" data-modal-close class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">Batal</button>
            <button type="submit" class="{{ $buttonClass }} bg-primary text-primary-foreground">Simpan Perubahan</button>
        </div>
    </form>
</div>
