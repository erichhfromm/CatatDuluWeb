<div class="h-20 px-6 flex items-center gap-3 border-b border-sidebar-border shrink-0">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20">{!! $icon('wallet', 'w-5 h-5 text-white') !!}</div>
    <div><div class="font-bold text-[15px] tracking-tight">CatatDulu</div><div class="text-[11px] text-muted-foreground">Personal Finance</div></div>
</div>
<nav class="flex-1 overflow-y-auto p-4 space-y-6">
    @foreach ($groups as $group)
        <div>
            <div class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-3">{{ $group }}</div>
            <div class="space-y-1">
                @foreach (array_filter($navItems, fn ($item) => $item['group'] === $group) as $item)
                    @php $active = $screen === $item['key']; @endphp
                    <a href="{{ $url($item['key']) }}" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all {{ $active ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground' }}">
                        {!! $icon($item['icon'], 'w-[18px] h-[18px] '.($active ? 'text-primary' : '')) !!}
                        <span>{{ $item['label'] }}</span>
                        @if ($active)<span class="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>@endif
                    </a>
                @endforeach
            </div>
        </div>
    @endforeach
</nav>
<div class="p-4 border-t border-sidebar-border shrink-0">
    <div class="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl p-4 text-white">
        <div class="flex items-center gap-2 mb-2">{!! $icon('sparkles') !!}<div class="text-xs font-semibold">Upgrade to Pro</div></div>
        <div class="text-[11px] text-white/80 mb-3">Unlock advanced analytics & unlimited reports</div>
        <button class="w-full bg-white text-primary text-xs font-semibold py-1.5 rounded-md hover:bg-white/90">Upgrade</button>
    </div>
</div>
