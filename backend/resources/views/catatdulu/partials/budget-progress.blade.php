<div class="bg-card border border-border rounded-2xl p-6">
    <div class="flex items-center justify-between mb-5"><div><h3>Budget Progress</h3><p class="text-xs text-muted-foreground mt-1">Mei 2026</p></div><a href="{{ $url('budget') }}" class="text-xs font-semibold text-primary">Detail -></a></div>
    <div class="space-y-4">
        @foreach (array_slice($budgets, 0, 5) as $b)
            @php $pct = round(($b['spent'] / $b['allocated']) * 100); @endphp
            <div><div class="flex items-center justify-between text-xs mb-1.5"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full" style="background: {{ $b['color'] }}"></div><span class="font-semibold">{{ $b['category'] }}</span></div><span class="text-muted-foreground">{{ $pct }}%</span></div><div class="h-1.5 bg-muted rounded-full overflow-hidden"><div class="h-full rounded-full transition-all" style="width: {{ min($pct, 100) }}%; background: {{ $pct > 90 ? '#EF4444' : $b['color'] }}"></div></div><div class="flex justify-between text-[10px] text-muted-foreground mt-1"><span>{{ $fmt($b['spent']) }}</span><span>dari {{ $fmt($b['allocated']) }}</span></div></div>
        @endforeach
    </div>
</div>
