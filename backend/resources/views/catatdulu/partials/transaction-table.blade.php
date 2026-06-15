<div class="overflow-x-auto {{ $compact ? '-mx-6' : '' }}">
    <table class="w-full text-sm">
        <thead class="bg-muted/40 text-xs text-muted-foreground">
            <tr>
                @if (! $compact)<th class="py-3 px-5 text-left font-semibold"><input type="checkbox" class="rounded"></th><th class="py-3 px-2 text-left font-semibold">ID</th>@endif
                <th class="py-3 {{ $compact ? 'px-6' : 'px-2' }} text-left font-semibold">Transaksi</th>
                <th class="py-3 px-2 text-left font-semibold">Kategori</th>
                <th class="py-3 px-2 text-left font-semibold">Tanggal</th>
                <th class="py-3 px-2 text-left font-semibold">Status</th>
                <th class="py-3 px-6 text-right font-semibold">Nominal</th>
                @if (! $compact)<th class="py-3 px-5"></th>@endif
            </tr>
        </thead>
        <tbody>
            @foreach ($rows as $t)
                <tr class="border-t border-border hover:bg-muted/30">
                    @if (! $compact)<td class="py-3 px-5"><input type="checkbox" class="rounded"></td><td class="py-3 px-2 text-xs font-mono text-muted-foreground">{{ $t['id'] }}</td>@endif
                    <td class="py-3 {{ $compact ? 'px-6' : 'px-2' }}">
                        <a href="{{ $transactionUrl($t['db_id'] ?? null) }}" class="flex items-center gap-3">
                            <span class="w-9 h-9 rounded-lg flex items-center justify-center {{ $t['type'] === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }}">{!! $icon($t['type'] === 'income' ? 'down' : 'up') !!}</span>
                            <span><span class="block text-sm font-semibold">{{ $t['note'] }}</span><span class="block text-[11px] text-muted-foreground">{{ $t['id'] }} · {{ $t['account'] }}</span></span>
                        </a>
                    </td>
                    <td class="py-3 px-2">{!! $badge($t['category'], 'outline') !!}</td>
                    <td class="py-3 px-2 text-xs text-muted-foreground">{{ $t['date'] }}</td>
                    <td class="py-3 px-2">{!! $badge($t['status'], $t['status'] === 'completed' ? 'success' : 'warning') !!}</td>
                    <td class="py-3 px-6 text-right font-semibold {{ $t['type'] === 'income' ? 'text-emerald-600' : 'text-red-600' }}">{{ $t['type'] === 'income' ? '+' : '-' }}{{ $fmt($t['amount']) }}</td>
                    @if (! $compact)<td class="py-3 px-5"><button class="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">...</button></td>@endif
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
