@php
    $accents = [
        'primary' => 'from-blue-50 to-white text-primary',
        'success' => 'from-emerald-50 to-white text-emerald-700',
        'warning' => 'from-amber-50 to-white text-amber-700',
        'danger' => 'from-red-50 to-white text-red-700',
    ];
@endphp
<div class="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br {{ $accents[$accent] ?? $accents['primary'] }} flex items-center justify-center">{!! $icon($ic, 'w-5 h-5') !!}</div>
        @if (! empty($delta)){!! $badge($delta, str_starts_with($delta, '-') ? 'danger' : 'success') !!}@endif
    </div>
    <div class="text-xs text-muted-foreground mb-1">{{ $label }}</div>
    <div class="text-2xl font-bold tracking-tight">{{ $value }}</div>
</div>
