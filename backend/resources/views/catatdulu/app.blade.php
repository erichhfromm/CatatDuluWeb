@php
    use App\Support\CatatDuluData;

    $transactions = $data['transactions'];
    $monthlyTrend = $data['monthlyTrend'];
    $expenseByCategory = $data['expenseByCategory'];
    $budgets = $data['budgets'];
    $notifications = $data['notifications'];
    $dashboardStats = $data['dashboardStats'] ?? null;
    $currentMonthLabel = $currentMonthLabel ?? now()->format('F Y');
    $fmt = fn ($amount) => CatatDuluData::formatIDR($amount);
    $screen = $screen ?? 'splash';
    $url = fn ($name) => $name === 'splash' ? route('catatdulu.home') : route('catatdulu.screen', $name);
    $transactionUrl = fn (?int $dbId = null) => $dbId
        ? route('catatdulu.screen', ['screen' => 'transaction-detail', 'id' => $dbId])
        : $url('transaction-detail');
    $categories = $categories ?? ['income' => [], 'expense' => []];
    $selectedTransaction = $selectedTransaction ?? null;
    $incomeRows = array_values(array_filter($transactions, fn ($t) => $t['type'] === 'income'));
    $expenseRows = array_values(array_filter($transactions, fn ($t) => $t['type'] === 'expense'));
    $totalAlloc = array_sum(array_column($budgets, 'allocated'));
    $totalSpent = array_sum(array_column($budgets, 'spent'));
    $unreadCount = count(array_filter($notifications, fn ($n) => ! $n['read']));

    $icon = function (string $name, string $class = 'w-4 h-4'): string {
        $paths = [
            'wallet' => '<path d="M19 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h14v4"/><path d="M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2"/><path d="M18 14h.01"/>',
            'dashboard' => '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
            'down' => '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
            'up' => '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
            'chart' => '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
            'file' => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
            'bell' => '<path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
            'user' => '<path d="M19 21a7 7 0 0 0-14 0"/><circle cx="12" cy="7" r="4"/>',
            'settings' => '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.52a2 2 0 0 1-1 1.72l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.52a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
            'search' => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
            'sparkles' => '<path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>',
            'menu' => '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
            'x' => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
            'logout' => '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
            'plus' => '<path d="M5 12h14"/><path d="M12 5v14"/>',
            'trend-up' => '<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
            'trend-down' => '<path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/>',
            'piggy' => '<path d="M19 5c-1.5 0-2.8.5-3.7 1.4A8 8 0 0 0 3 12v2a3 3 0 0 0 3 3h1v2h3v-2h4v2h3v-2h1a3 3 0 0 0 3-3v-1h2v-3h-2a7 7 0 0 0-.7-2.9C20.8 6.2 20.4 5 19 5z"/><path d="M8 11h.01"/>',
            'target' => '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
            'download' => '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
            'filter' => '<path d="M22 3H2l8 9.5V20l4 2v-9.5z"/>',
            'calendar' => '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
            'tag' => '<path d="M12.6 2H4a2 2 0 0 0-2 2v8.6a2 2 0 0 0 .6 1.4l7.4 7.4a2 2 0 0 0 2.8 0l8.6-8.6a2 2 0 0 0 0-2.8L14 2.6A2 2 0 0 0 12.6 2z"/><circle cx="7.5" cy="7.5" r=".5"/>',
            'edit' => '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
            'trash' => '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
            'check' => '<path d="M20 6 9 17l-5-5"/>',
            'alert' => '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
            'info' => '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
            'shield' => '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/>',
            'mail' => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/>',
            'lock' => '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
            'camera' => '<path d="M14.5 4h-5L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
            'globe' => '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
            'moon' => '<path d="M12 3a6 6 0 0 0 9 7.5A9 9 0 1 1 12 3z"/>',
            'inbox' => '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z"/>',
        ];
        $body = $paths[$name] ?? $paths['info'];

        return '<svg xmlns="http://www.w3.org/2000/svg" class="'.$class.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'.$body.'</svg>';
    };

    $badge = function (string $text, string $variant = 'default'): string {
        $classes = [
            'default' => 'bg-muted text-foreground',
            'success' => 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            'warning' => 'bg-amber-50 text-amber-700 border border-amber-200',
            'danger' => 'bg-red-50 text-red-700 border border-red-200',
            'info' => 'bg-blue-50 text-blue-700 border border-blue-200',
            'outline' => 'border border-border text-foreground',
        ];

        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium '.($classes[$variant] ?? $classes['default']).'">'.e($text).'</span>';
    };

    $buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 h-10 px-4 text-sm';
    $navItems = [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'icon' => 'dashboard', 'group' => 'Overview'],
        ['key' => 'income', 'label' => 'Income', 'icon' => 'down', 'group' => 'Manage'],
        ['key' => 'expense', 'label' => 'Expense', 'icon' => 'up', 'group' => 'Manage'],
        ['key' => 'budget', 'label' => 'Budget', 'icon' => 'wallet', 'group' => 'Manage'],
        ['key' => 'analytics', 'label' => 'Analytics', 'icon' => 'chart', 'group' => 'Insights'],
        ['key' => 'reports', 'label' => 'Reports', 'icon' => 'file', 'group' => 'Insights'],
        ['key' => 'notifications', 'label' => 'Notifications', 'icon' => 'bell', 'group' => 'Account'],
        ['key' => 'profile', 'label' => 'Profile', 'icon' => 'user', 'group' => 'Account'],
        ['key' => 'settings', 'label' => 'Settings', 'icon' => 'settings', 'group' => 'Account'],
        ['key' => 'design-system', 'label' => 'Design System', 'icon' => 'sparkles', 'group' => 'System'],
        ['key' => 'empty', 'label' => 'Empty States', 'icon' => 'inbox', 'group' => 'System'],
        ['key' => 'error', 'label' => 'Error States', 'icon' => 'alert', 'group' => 'System'],
    ];
    $groups = array_values(array_unique(array_column($navItems, 'group')));

    $barChart = function (array $rows, string $incomeColor = '#3B82F6', string $expenseColor = '#EF4444') {
        $max = max(1, ...array_map(fn ($r) => max($r['income'], $r['expense']), $rows ?: [['income' => 0, 'expense' => 0]]));
        return view('catatdulu.partials.bar-chart', compact('rows', 'max', 'incomeColor', 'expenseColor'))->render();
    };
@endphp

<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>CatatDulu - Personal Finance</title>
    <link rel="stylesheet" href="{{ asset('assets/app.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/catatdulu.css') }}">
</head>
<body>
@if ($screen === 'splash')
    <div class="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2347A8] to-[#3B82F6] flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_60%)]"></div>
        <div class="text-center text-white relative z-10 animate-in">
            <div class="float-soft w-24 h-24 mx-auto rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl">
                {!! $icon('wallet', 'w-12 h-12') !!}
            </div>
            <h1 class="text-white text-4xl font-bold mb-2">CatatDulu</h1>
            <p class="text-white/80 mb-10">Personal Finance Management</p>
            <div class="flex items-center justify-center gap-1.5 mb-8">
                <div class="w-2 h-2 rounded-full bg-white pulse-dot"></div>
                <div class="w-2 h-2 rounded-full bg-white pulse-dot delay-150"></div>
                <div class="w-2 h-2 rounded-full bg-white pulse-dot delay-300"></div>
            </div>
            <a href="{{ $url('login') }}" class="px-6 py-2 bg-white/15 hover:bg-white/25 rounded-full text-sm backdrop-blur border border-white/20">Lanjutkan -></a>
        </div>
    </div>
@elseif ($screen === 'login' || $screen === 'register')
    <div class="min-h-screen grid lg:grid-cols-2">
        <div class="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1E3A8A] via-[#2347A8] to-[#3B82F6] text-white p-12 relative overflow-hidden">
            <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
            <div class="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"></div>
            <div class="relative z-10 flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">{!! $icon('wallet', 'w-6 h-6') !!}</div>
                <div><div class="font-bold text-lg">CatatDulu</div><div class="text-xs text-white/70">Personal Finance Platform</div></div>
            </div>
            <div class="relative z-10 space-y-6">
                <h1 class="text-white text-4xl leading-tight font-bold">Catat keuangan, kelola masa depan.</h1>
                <p class="text-white/80 max-w-md">Platform manajemen keuangan personal dengan dashboard interaktif, budget cerdas, dan laporan otomatis untuk semua kebutuhan finansialmu.</p>
                <div class="grid grid-cols-1 gap-3 max-w-sm">
                    @foreach ([['trend-up', 'Analisa cashflow real-time'], ['shield', 'Enkripsi end-to-end & aman'], ['check', 'Laporan PDF / Excel siap pakai']] as [$i, $text])
                        <div class="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10">{!! $icon($i, 'w-4 h-4 text-blue-200') !!}<span class="text-sm">{{ $text }}</span></div>
                    @endforeach
                </div>
            </div>
            <div class="relative z-10 flex items-center gap-4">
                <div class="flex -space-x-2">
                    @foreach (['#fda4af', '#fde68a', '#a7f3d0', '#bfdbfe'] as $c)
                        <div class="w-8 h-8 rounded-full border-2 border-white" style="background: {{ $c }}"></div>
                    @endforeach
                </div>
                <div class="text-xs text-white/80"><b class="text-white">10,000+</b> pengguna aktif mempercayai CatatDulu</div>
            </div>
        </div>
        <div class="flex items-center justify-center p-8 bg-background">
            <div class="w-full max-w-md">
                @if ($screen === 'login')
                    <h1 class="mb-2">Selamat datang kembali</h1>
                    <p class="text-muted-foreground mb-8">Masuk ke akun untuk melanjutkan mengelola keuangan Anda.</p>
                    <form action="{{ route('catatdulu.login.post') }}" method="POST" class="space-y-4">
                        @csrf
                        <div><label class="block text-xs font-semibold text-foreground mb-1.5">Email <span class="text-destructive">*</span></label><div class="relative">{!! $icon('mail', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input type="email" name="email" value="ariana@catatdulu.id" class="w-full h-10 px-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition pl-10" required></div></div>
                        <div><label class="block text-xs font-semibold text-foreground mb-1.5">Password <span class="text-destructive">*</span></label><div class="relative">{!! $icon('lock', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input data-password type="password" name="password" value="password123" class="w-full h-10 px-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition pl-10 pr-10" required><button data-toggle-password type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{!! $icon('info') !!}</button></div></div>
                        <div class="flex items-center justify-between text-xs"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="remember" checked class="rounded border-border"> Ingat saya</label><button type="button" class="text-primary font-medium hover:underline">Lupa password?</button></div>
                        <button type="submit" class="{{ $buttonClass }} w-full h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-blue-900/10">{!! $icon('down') !!} Masuk</button>
                        <div class="relative my-4 text-center text-xs text-muted-foreground"><div class="absolute inset-y-1/2 inset-x-0 border-t border-border"></div><span class="relative bg-background px-3">atau lanjutkan dengan</span></div>
                        <div class="grid grid-cols-2 gap-3"><button type="button" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">Google</button><button type="button" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">Apple</button></div>
                        <p class="text-center text-xs text-muted-foreground mt-6">Belum punya akun? <a href="{{ $url('register') }}" class="text-primary font-semibold hover:underline">Daftar sekarang</a></p>
                    </form>
                @else
                    <h1 class="mb-2">Buat akun baru</h1>
                    <p class="text-muted-foreground mb-8">Gratis selamanya. Tanpa kartu kredit.</p>
                    <form action="{{ route('catatdulu.register.post') }}" method="POST" class="space-y-4">
                        @csrf
                        <div><label class="block text-xs font-semibold text-foreground mb-1.5">Nama Lengkap <span class="text-destructive">*</span></label><div class="relative">{!! $icon('user', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input name="name" placeholder="Ariana Rizki" class="w-full h-10 px-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition pl-10" required></div></div>
                        <div><label class="block text-xs font-semibold text-foreground mb-1.5">Email <span class="text-destructive">*</span></label><div class="relative">{!! $icon('mail', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input type="email" name="email" placeholder="you@example.com" class="w-full h-10 px-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition pl-10" required></div></div>
                        <div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-foreground mb-1.5">Password <span class="text-destructive">*</span></label><input type="password" name="password" placeholder="Min. 8 karakter" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" required></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Konfirmasi <span class="text-destructive">*</span></label><input type="password" name="password_confirmation" placeholder="Ulangi password" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" required></div></div>
                        <label class="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" required class="mt-0.5 rounded border-border"><span>Saya menyetujui <a class="text-primary font-medium">Syarat & Ketentuan</a> dan <a class="text-primary font-medium">Kebijakan Privasi</a> CatatDulu.</span></label>
                        <button type="submit" class="{{ $buttonClass }} w-full h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90">{!! $icon('plus') !!} Buat Akun</button>
                        <p class="text-center text-xs text-muted-foreground mt-4">Sudah punya akun? <a href="{{ $url('login') }}" class="text-primary font-semibold hover:underline">Masuk di sini</a></p>
                    </form>
                @endif
            </div>
        </div>
    </div>
@else
    <div class="min-h-screen bg-background flex">
        <aside class="hidden lg:flex w-[280px] bg-sidebar border-r border-sidebar-border flex-col h-screen sticky top-0 shrink-0">
            @include('catatdulu.partials.sidebar', ['navItems' => $navItems, 'groups' => $groups, 'screen' => $screen, 'url' => $url, 'icon' => $icon])
        </aside>
        <aside id="mobile-drawer" class="fixed top-0 left-0 bottom-0 w-[280px] max-w-[85vw] bg-sidebar border-r border-sidebar-border z-50 flex-col lg:hidden hidden">
            @include('catatdulu.partials.sidebar', ['navItems' => $navItems, 'groups' => $groups, 'screen' => $screen, 'url' => $url, 'icon' => $icon])
        </aside>
        <div id="drawer-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden hidden"></div>
        <main class="flex-1 min-w-0 w-full">
            <header class="h-16 sm:h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 gap-2">
                <button id="open-drawer" class="lg:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted" aria-label="Open menu">{!! $icon('menu', 'w-5 h-5') !!}</button>
                <div class="hidden md:flex items-center gap-4 flex-1 max-w-xl"><div class="relative flex-1">{!! $icon('search', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input placeholder="Search transactions, categories, reports..." class="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/40 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"></div></div>
                <div class="md:hidden flex items-center gap-2 flex-1 min-w-0"><div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shrink-0">{!! $icon('wallet', 'w-4 h-4 text-white') !!}</div><div class="font-bold text-sm tracking-tight truncate">CatatDulu</div></div>
                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button id="open-search" class="md:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted">{!! $icon('search') !!}</button>
                    <a href="{{ $url('notifications') }}" class="relative w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted">{!! $icon('bell') !!}<span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive"></span></a>
                    <form action="{{ route('catatdulu.logout.post') }}" method="POST" class="hidden sm:flex m-0">@csrf<button type="submit" class="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted" title="Logout">{!! $icon('logout') !!}</button></form>
                    <a href="{{ $url('profile') }}" class="flex items-center gap-2 pl-1 pr-1 sm:pl-2 sm:pr-3 py-1 sm:py-1.5 rounded-lg sm:border border-border hover:bg-muted"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold flex items-center justify-center">{{ isset($user) ? strtoupper(substr($user->name, 0, 2)) : 'AR' }}</div><div class="text-left hidden xl:block"><div class="text-xs font-semibold leading-tight">{{ $user->name ?? 'User' }}</div><div class="text-[10px] text-muted-foreground leading-tight">Premium</div></div></a>
                </div>
            </header>
            <div id="mobile-search" class="md:hidden fixed top-0 inset-x-0 z-40 bg-card border-b border-border p-3 items-center gap-2 shadow-lg hidden"><div class="relative flex-1">{!! $icon('search', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input autofocus placeholder="Search..." class="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"></div><button id="close-search" class="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center">{!! $icon('x') !!}</button></div>
            <div class="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
                @if (session('success'))
                    <div class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{{ session('success') }}</div>
                @endif
                @if (session('error'))
                    <div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ session('error') }}</div>
                @endif
                @if ($errors->any())
                    <div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        <ul class="list-disc pl-5 space-y-1">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                @include('catatdulu.partials.screen', compact('screen', 'transactions', 'incomeRows', 'expenseRows', 'monthlyTrend', 'expenseByCategory', 'budgets', 'notifications', 'dashboardStats', 'currentMonthLabel', 'user', 'selectedTransaction', 'categories', 'totalAlloc', 'totalSpent', 'unreadCount', 'fmt', 'icon', 'badge', 'buttonClass', 'url', 'transactionUrl', 'barChart'))
            </div>
        </main>
    </div>
@endif
<script src="{{ asset('assets/catatdulu.js') }}"></script>
</body>
</html>
