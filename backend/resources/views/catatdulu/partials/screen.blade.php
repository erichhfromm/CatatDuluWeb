@if ($screen === 'dashboard')
    @php
        $greetingName = isset($user) ? explode(' ', $user->name)[0] : 'Pengguna';
        $stats = $dashboardStats ?? [
            'total_balance' => 0,
            'monthly_income' => 0,
            'monthly_expense' => 0,
            'net_monthly' => 0,
            'income_change' => '0%',
            'expense_change' => '0%',
            'savings_change' => '0%',
        ];
        $dashboardCards = [
            ['Total Saldo', $fmt($stats['total_balance']), '', 'wallet', 'primary'],
            ['Pemasukan Bulan Ini', $fmt($stats['monthly_income']), $stats['income_change'], 'trend-up', 'success'],
            ['Pengeluaran Bulan Ini', $fmt($stats['monthly_expense']), $stats['expense_change'], 'trend-down', 'danger'],
            ['Tabungan', $fmt($stats['net_monthly']), $stats['savings_change'], 'piggy', 'warning'],
        ];
    @endphp
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div><h1>Halo, {{ $greetingName }}</h1><p class="text-muted-foreground mt-1">Berikut ringkasan keuangan Anda untuk bulan {{ $currentMonthLabel }}.</p></div>
            <div class="flex gap-2"><a href="{{ $url('reports') }}" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">{!! $icon('file') !!} Laporan</a><a href="{{ $url('income') }}" class="{{ $buttonClass }} bg-primary text-primary-foreground hover:bg-primary/90">{!! $icon('plus') !!} Tambah Transaksi</a></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @foreach ($dashboardCards as [$label, $value, $delta, $ic, $accent])
                @include('catatdulu.partials.stat-card', compact('label', 'value', 'delta', 'ic', 'accent', 'icon', 'badge'))
            @endforeach
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-card border border-border rounded-2xl lg:col-span-2 p-6">
                <div class="flex items-center justify-between mb-6"><div><h3>Cash Flow</h3><p class="text-xs text-muted-foreground mt-1">Pemasukan vs pengeluaran 6 bulan terakhir</p></div><div class="flex gap-2">{!! $badge('Income', 'info') !!}{!! $badge('Expense', 'danger') !!}</div></div>
                {!! $barChart($monthlyTrend, '#3B82F6', '#EF4444') !!}
            </div>
            <div class="bg-card border border-border rounded-2xl p-6">
                <h3 class="mb-4">Quick Actions</h3>
                <div class="grid grid-cols-2 gap-3">
                    @foreach ([['trend-up', 'Income', 'bg-emerald-50 text-emerald-700', 'income'], ['trend-down', 'Expense', 'bg-red-50 text-red-700', 'expense'], ['target', 'Budget', 'bg-amber-50 text-amber-700', 'budget'], ['file', 'Reports', 'bg-blue-50 text-blue-700', 'reports']] as [$ic, $label, $color, $go])
                        <a href="{{ $url($go) }}" class="flex flex-col items-start gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition"><div class="w-9 h-9 rounded-lg {{ $color }} flex items-center justify-center">{!! $icon($ic) !!}</div><div class="text-xs font-semibold">{{ $label }}</div></a>
                    @endforeach
                </div>
                <div class="mt-6 pt-6 border-t border-border">
                    <h4 class="mb-3">Notifikasi Terbaru</h4>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3"><div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500"></div><div><div class="text-xs font-semibold">Budget Belanja 92%</div><div class="text-[11px] text-muted-foreground">Sisa Rp 120.000</div></div></div>
                        <div class="flex items-start gap-3"><div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></div><div><div class="text-xs font-semibold">Gaji masuk</div><div class="text-[11px] text-muted-foreground">+Rp 12.500.000</div></div></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-card border border-border rounded-2xl lg:col-span-2 p-6">
                <div class="flex items-center justify-between mb-5"><div><h3>Transaksi Terbaru</h3><p class="text-xs text-muted-foreground mt-1">5 transaksi terakhir</p></div><a href="{{ $url('expense') }}" class="{{ $buttonClass }} hover:bg-muted text-foreground h-8 px-3 text-xs">Lihat semua -></a></div>
                @include('catatdulu.partials.transaction-table', ['rows' => array_slice($transactions, 0, 5), 'compact' => true, 'fmt' => $fmt, 'badge' => $badge, 'icon' => $icon, 'url' => $url, 'transactionUrl' => $transactionUrl])
            </div>
            @include('catatdulu.partials.budget-progress', compact('budgets', 'fmt', 'url'))
        </div>
    </div>
@elseif ($screen === 'income' || $screen === 'expense')
    @php
        $rows = $screen === 'income' ? $incomeRows : $expenseRows;
        $total = array_sum(array_column($rows, 'amount'));
        $title = $screen === 'income' ? 'Pemasukan' : 'Pengeluaran';
    @endphp
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"><div><h1>{{ $title }}</h1><p class="text-muted-foreground mt-1">Total {{ count($rows) }} transaksi · {{ $fmt($total) }}</p></div></div>
        @if ($screen === 'expense')
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                @foreach (['Semua', 'Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan'] as $index => $cat)
                    <button class="px-3 py-2 rounded-lg text-xs font-semibold border transition {{ $index === 0 ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted' }}">{{ $cat }}</button>
                @endforeach
            </div>
        @endif
        <div class="bg-card border border-border rounded-2xl p-0 overflow-hidden">
            <div class="p-5 flex flex-col md:flex-row gap-3 md:items-center justify-between border-b border-border">
                <form method="GET" action="{{ $url($screen) }}" class="flex gap-3 flex-1 m-0"><div class="relative flex-1 max-w-sm">{!! $icon('search', 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground') !!}<input name="search" value="{{ request('search') }}" placeholder="Cari transaksi..." class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm pl-10"></div><button type="submit" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">{!! $icon('filter') !!} Cari</button></form>
                <div class="flex gap-2"><a href="{{ route('catatdulu.reports.exportExcel') }}" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">{!! $icon('download') !!} Export</a><button data-modal-open="tx-modal" class="{{ $buttonClass }} bg-primary text-primary-foreground hover:bg-primary/90">{!! $icon('plus') !!} Tambah {{ $screen === 'income' ? 'Pemasukan' : 'Pengeluaran' }}</button></div>
            </div>
            @include('catatdulu.partials.transaction-table', ['rows' => $rows, 'compact' => false, 'fmt' => $fmt, 'badge' => $badge, 'icon' => $icon, 'url' => $url, 'transactionUrl' => $transactionUrl])
            <div class="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground"><span>Menampilkan {{ count($rows) }} dari {{ count($rows) }} transaksi</span><div class="flex gap-1"><button class="px-3 py-1 rounded-md border border-border hover:bg-muted">Prev</button><button class="px-3 py-1 rounded-md bg-primary text-white">1</button><button class="px-3 py-1 rounded-md border border-border hover:bg-muted">2</button><button class="px-3 py-1 rounded-md border border-border hover:bg-muted">Next</button></div></div>
        </div>
        @include('catatdulu.partials.transaction-modal', ['type' => $screen, 'buttonClass' => $buttonClass, 'categories' => $categories ?? []])
    </div>
@elseif ($screen === 'transaction-detail' && $selectedTransaction)
    @php
        $t = $selectedTransaction;
        $backScreen = $t['type'] === 'income' ? 'income' : 'expense';
    @endphp
    <div class="space-y-6">
        <a href="{{ $url($backScreen) }}" class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">&lt; Kembali</a>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-card border border-border rounded-2xl lg:col-span-2 p-8">
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-6">
                    <div class="flex items-center gap-4"><div class="w-14 h-14 rounded-2xl flex items-center justify-center {{ $t['type'] === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }}">{!! $icon($t['type'] === 'income' ? 'down' : 'up', 'w-7 h-7') !!}</div><div><div class="text-xs text-muted-foreground">{{ $t['id'] }}</div><h2 class="mt-0.5">{{ $t['note'] }}</h2>{!! $badge($t['status'], $t['status'] === 'completed' ? 'success' : 'warning') !!}</div></div>
                    <div class="text-left md:text-right"><div class="text-xs text-muted-foreground">Nominal</div><div class="text-3xl font-bold {{ $t['type'] === 'income' ? 'text-emerald-600' : 'text-red-600' }}">{{ $t['type'] === 'income' ? '+' : '-' }}{{ $fmt($t['amount']) }}</div></div>
                </div>
                <div class="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                    @foreach ([['tag', 'Kategori', $t['category']], ['calendar', 'Tanggal', $t['date']], ['wallet', 'Akun', $t['account']], ['file', 'Tipe', $t['type'] === 'income' ? 'Pemasukan' : 'Pengeluaran']] as [$ic, $label, $val])
                        <div class="flex items-center gap-3 p-4 rounded-xl bg-muted/40"><div class="w-9 h-9 rounded-lg bg-card flex items-center justify-center">{!! $icon($ic, 'w-4 h-4 text-primary') !!}</div><div><div class="text-[11px] text-muted-foreground">{{ $label }}</div><div class="text-sm font-semibold">{{ $val }}</div></div></div>
                    @endforeach
                </div>
                <div class="mt-6"><label class="block text-xs font-semibold text-foreground mb-1.5">Catatan</label><div class="p-4 bg-muted/40 rounded-xl text-sm text-muted-foreground">{{ $t['note'] }} — disimpan pada {{ $t['date'] }} dengan metode pembayaran {{ $t['account'] }}.</div></div>
            </div>
            <div class="space-y-4">
                <div class="bg-card border border-border rounded-2xl p-5">
                    <h4 class="mb-3">Aksi</h4>
                    <div class="space-y-2">
                        <button type="button" data-modal-open="tx-edit-modal" class="{{ $buttonClass }} w-full bg-primary text-primary-foreground">{!! $icon('edit') !!} Edit Transaksi</button>
                        <form method="POST" action="{{ route('catatdulu.transactions.destroy', $t['db_id']) }}" class="m-0" onsubmit="return confirm('Hapus transaksi ini? Tindakan tidak dapat dibatalkan.');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="{{ $buttonClass }} w-full bg-destructive text-destructive-foreground">{!! $icon('trash') !!} Hapus</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        @include('catatdulu.partials.transaction-edit-modal', ['t' => $t, 'buttonClass' => $buttonClass, 'categories' => $categories ?? []])
    </div>
@elseif ($screen === 'budget')
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"><div><h1>Budget Planning</h1><p class="text-muted-foreground mt-1">Atur anggaran bulanan untuk setiap kategori pengeluaran Anda.</p></div><button data-modal-open="budget-modal" class="{{ $buttonClass }} bg-primary text-primary-foreground hover:bg-primary/90">{!! $icon('plus') !!} Buat Budget</button></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            @foreach ([['Total Anggaran', $fmt($totalAlloc), '', 'target', 'primary'], ['Sudah Terpakai', $fmt($totalSpent), round(($totalSpent / $totalAlloc) * 100).'%', 'trend-down', 'warning'], ['Sisa Anggaran', $fmt($totalAlloc - $totalSpent), '+22%', 'trend-up', 'success']] as [$label, $value, $delta, $ic, $accent])
                @include('catatdulu.partials.stat-card', compact('label', 'value', 'delta', 'ic', 'accent', 'icon', 'badge'))
            @endforeach
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach ($budgets as $b)
                @php $pct = round(($b['spent'] / $b['allocated']) * 100); $status = $pct > 90 ? 'danger' : ($pct > 70 ? 'warning' : 'success'); @endphp
                <div class="bg-card border border-border rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all p-5"><div class="flex items-start justify-between mb-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: {{ $b['color'] }}15; color: {{ $b['color'] }}">{!! $icon('target', 'w-5 h-5') !!}</div><div><div class="font-semibold">{{ $b['category'] }}</div><div class="text-[11px] text-muted-foreground">Bulanan</div></div></div>{!! $badge($pct.'%', $status) !!}</div><div class="mb-3"><div class="text-2xl font-bold">{{ $fmt($b['spent']) }}</div><div class="text-xs text-muted-foreground">dari {{ $fmt($b['allocated']) }}</div></div><div class="h-2 bg-muted rounded-full overflow-hidden mb-3"><div class="h-full rounded-full transition-all" style="width: {{ min($pct, 100) }}%; background: {{ $pct > 90 ? '#EF4444' : $b['color'] }}"></div></div><div class="flex items-center justify-between text-xs"><span class="text-muted-foreground">Sisa: <b class="text-foreground">{{ $fmt($b['allocated'] - $b['spent']) }}</b></span><button class="text-primary font-semibold hover:underline">Detail</button></div></div>
            @endforeach
        </div>
        @include('catatdulu.partials.budget-modal', compact('buttonClass'))
    </div>
@elseif ($screen === 'analytics')
    <div class="space-y-6">
        <div class="mb-6"><h1>Financial Analytics</h1><p class="text-muted-foreground mt-1">Pahami arus kas dan pola keuangan Anda dengan visualisasi mendalam.</p></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-card border border-border rounded-2xl lg:col-span-2 p-6"><h3 class="mb-1">Tren Bulanan</h3><p class="text-xs text-muted-foreground mb-4">Pemasukan vs pengeluaran dalam 6 bulan terakhir</p>{!! $barChart($monthlyTrend, '#3B82F6', '#EF4444') !!}</div>
            <div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-1">Kategori Pengeluaran</h3><p class="text-xs text-muted-foreground mb-4">Distribusi Mei 2026</p><div class="donut" style="--segments: conic-gradient(#1E3A8A 0 25%, #3B82F6 25% 43%, #10B981 43% 68%, #F59E0B 68% 77%, #EF4444 77% 87%, #8B5CF6 87% 95%, #06B6D4 95% 100%)"></div><div class="space-y-2 mt-4">@foreach (array_slice($expenseByCategory, 0, 4) as $c)<div class="flex items-center justify-between text-xs"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full" style="background: {{ $c['color'] }}"></div>{{ $c['name'] }}</div><span class="font-semibold">{{ $fmt($c['value']) }}</span></div>@endforeach</div></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-1">Pertumbuhan Pemasukan</h3><p class="text-xs text-muted-foreground mb-4">Tren 6 bulan</p>{!! $barChart($monthlyTrend, '#10B981', '#D1FAE5') !!}</div><div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-1">Cash Flow Analysis</h3><p class="text-xs text-muted-foreground mb-4">Net cash flow per bulan</p><div class="net-line">@foreach ($monthlyTrend as $m)<div><span style="height: {{ max(18, round((($m['income'] - $m['expense']) / 16000000) * 190)) }}px"></span><small>{{ $m['month'] }}</small></div>@endforeach</div></div></div>
        <div class="bg-card border border-border rounded-2xl p-6"><div class="flex items-center gap-2 mb-4">{!! $icon('sparkles', 'w-5 h-5 text-primary') !!}<h3>Financial Insights</h3></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4">@foreach ([['trend-up', 'emerald', 'Pemasukan naik 17%', 'Pemasukan bulan ini meningkat dibanding April. Pertahankan momentum!'], ['alert', 'amber', 'Kategori Belanja tinggi', 'Pengeluaran belanja 92% dari budget. Pertimbangkan menahan pembelian non-esensial.'], ['info', 'blue', 'Peluang menabung', 'Sisa cashflow sebesar 15jt bisa Anda alokasikan ke reksadana atau emas digital.']] as [$ic, $color, $title, $desc])<div class="p-4 rounded-xl border bg-{{ $color }}-50 border-{{ $color }}-100"><div class="w-9 h-9 rounded-lg bg-{{ $color }}-100 text-{{ $color }}-700 flex items-center justify-center mb-3">{!! $icon($ic) !!}</div><div class="font-semibold text-sm mb-1">{{ $title }}</div><div class="text-xs text-muted-foreground">{{ $desc }}</div></div>@endforeach</div></div>
    </div>
@elseif ($screen === 'reports')
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"><div><h1>Laporan Keuangan</h1><p class="text-muted-foreground mt-1">Generate laporan lengkap dengan periode yang dapat disesuaikan.</p></div><div class="flex gap-2"><a href="{{ route('catatdulu.reports.exportExcel') }}" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">{!! $icon('download') !!} Export Excel</a><button class="{{ $buttonClass }} bg-primary text-primary-foreground">{!! $icon('file') !!} Export PDF</button></div></div>
        <div class="bg-card border border-border rounded-2xl p-5"><form method="GET" action="{{ route('catatdulu.reports.generate') }}"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-xs font-semibold text-foreground mb-1.5">Periode</label><select class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option>Bulan Ini</option><option>3 Bulan Terakhir</option></select></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Dari Tanggal</label><input type="date" name="start_date" value="{{ request('start_date', '2026-05-01') }}" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Sampai Tanggal</label><input type="date" name="end_date" value="{{ request('end_date', '2026-05-31') }}" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Tipe</label><select name="type" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option value="all">Semua</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></div></div><div class="mt-4 flex gap-2"><a href="{{ route('catatdulu.screen', 'reports') }}" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center">{!! $icon('filter') !!} Reset</a><button type="submit" class="{{ $buttonClass }} bg-primary text-primary-foreground">Generate Laporan</button></div></form></div>
        @php
            $reportStats = $dashboardStats ?? [
                'monthly_income' => 0,
                'monthly_expense' => 0,
                'net_monthly' => 0,
            ];
            $savingsRate = $reportStats['monthly_income'] > 0
                ? round(($reportStats['net_monthly'] / $reportStats['monthly_income']) * 100) . '%'
                : '0%';
            $reportCards = [
                ['Total Pemasukan', $fmt($reportStats['monthly_income']), '', 'trend-up', 'success'],
                ['Total Pengeluaran', $fmt($reportStats['monthly_expense']), '', 'trend-down', 'danger'],
                ['Net Saldo', $fmt($reportStats['net_monthly']), '', 'wallet', 'primary'],
                ['Tingkat Tabungan', $savingsRate, '', 'piggy', 'warning'],
            ];
        @endphp
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">@foreach ($reportCards as [$label, $value, $delta, $ic, $accent])@include('catatdulu.partials.stat-card', compact('label', 'value', 'delta', 'ic', 'accent', 'icon', 'badge'))@endforeach</div>
        <div class="bg-card border border-border rounded-2xl p-6"><div class="flex items-center justify-between mb-4"><div><h3>Ringkasan Bulanan</h3><p class="text-xs text-muted-foreground mt-1">Perbandingan 6 bulan</p></div>{!! $badge('PDF Ready', 'info') !!}</div>{!! $barChart($monthlyTrend, '#10B981', '#EF4444') !!}</div>
        <div class="bg-card border border-border rounded-2xl p-0 overflow-hidden"><div class="px-6 py-4 border-b border-border"><h3>Detail Transaksi Periode</h3><p class="text-xs text-muted-foreground mt-1">Semua transaksi dalam rentang yang dipilih</p></div>@include('catatdulu.partials.transaction-table', ['rows' => array_slice($transactions, 0, 8), 'compact' => true, 'fmt' => $fmt, 'badge' => $badge, 'icon' => $icon, 'url' => $url, 'transactionUrl' => $transactionUrl])</div>
    </div>
@elseif ($screen === 'notifications')
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"><div><h1>Notifikasi</h1><p class="text-muted-foreground mt-1">{{ $unreadCount }} notifikasi baru</p></div><form method="POST" action="{{ route('catatdulu.notifications.readAll') }}" class="m-0">@csrf<button type="submit" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">{!! $icon('check') !!} Tandai semua dibaca</button></form></div>
        <div class="flex gap-2 flex-wrap">@foreach (['Semua', 'Belum dibaca', 'Transaksi', 'Budget', 'Sistem'] as $index => $f)<button class="px-4 py-2 rounded-full text-xs font-semibold {{ $index === 0 ? 'bg-primary text-white' : 'border border-border hover:bg-muted' }}">{{ $f }}</button>@endforeach</div>
        <div class="bg-card border border-border rounded-2xl p-0 overflow-hidden">@foreach ($notifications as $n)<div class="flex items-start gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/30 {{ ! $n['read'] ? 'bg-blue-50/30' : '' }}"><div class="w-10 h-10 rounded-xl flex items-center justify-center {{ $n['type'] === 'success' ? 'text-emerald-600 bg-emerald-50' : ($n['type'] === 'warning' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50') }}">{!! $icon($n['type'] === 'success' ? 'check' : ($n['type'] === 'warning' ? 'alert' : 'info'), 'w-5 h-5') !!}</div><div class="flex-1 min-w-0"><div class="flex items-center gap-2"><div class="font-semibold text-sm">{{ $n['title'] }}</div>@if (! $n['read'])<div class="w-2 h-2 rounded-full bg-primary"></div>@endif</div><div class="text-xs text-muted-foreground mt-0.5">{{ $n['desc'] }}</div><div class="text-[11px] text-muted-foreground mt-1">{{ $n['time'] }}</div></div><button class="{{ $buttonClass }} hover:bg-muted text-foreground h-8 px-3 text-xs">Lihat</button></div>@endforeach</div>
    </div>
@elseif ($screen === 'profile')
    <div class="space-y-6">
        <div class="mb-6"><h1>Profil Pengguna</h1><p class="text-muted-foreground mt-1">Kelola informasi pribadi dan preferensi akun Anda.</p></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-card border border-border rounded-2xl p-6"><div class="flex flex-col items-center text-center"><div class="relative"><div class="rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold flex items-center justify-center shrink-0" style="width: 96px; height: 96px; font-size: 34px">AR</div><button class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white">{!! $icon('camera') !!}</button></div><h3 class="mt-4">Ariana Rizki</h3><p class="text-xs text-muted-foreground">ariana@catatdulu.id</p>{!! $badge('Premium Member', 'info') !!}<div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border w-full text-center">@foreach ([['124', 'Transaksi'], ['6', 'Budget'], ['2y', 'Member']] as [$k, $v])<div><div class="font-bold">{{ $k }}</div><div class="text-[11px] text-muted-foreground">{{ $v }}</div></div>@endforeach</div></div></div>
            <div class="bg-card border border-border rounded-2xl lg:col-span-2 p-6"><form action="{{ route('catatdulu.profile.update') }}" method="POST">@csrf<h3 class="mb-4">Informasi Pribadi</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-xs font-semibold text-foreground mb-1.5">Nama Lengkap</label><input name="name" value="{{ $user->name }}" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Email</label><input name="email" type="email" value="{{ $user->email }}" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Nomor Telepon</label><input name="phone" value="{{ $user->phone }}" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Mata Uang</label><select name="currency" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option value="IDR" {{ $user->currency === 'IDR' ? 'selected' : '' }}>IDR - Rupiah</option><option value="USD" {{ $user->currency === 'USD' ? 'selected' : '' }}>USD - Dollar</option></select></div></div><div class="flex justify-end gap-2 mt-6 pt-6 border-t border-border"><button type="reset" class="{{ $buttonClass }} border border-border bg-card hover:bg-muted text-foreground">Batal</button><button type="submit" class="{{ $buttonClass }} bg-primary text-primary-foreground">Simpan Perubahan</button></div></form></div>
        </div>
        <div class="bg-card border border-border rounded-2xl p-6"><form action="{{ route('catatdulu.profile.password') }}" method="POST">@csrf<h3 class="mb-1">Ubah Password</h3><p class="text-xs text-muted-foreground mb-4">Pastikan menggunakan password yang kuat dan unik.</p><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-xs font-semibold text-foreground mb-1.5">Password Lama <span class="text-destructive">*</span></label><input type="password" name="current_password" placeholder="Min. 8 karakter" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" required></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Password Baru <span class="text-destructive">*</span></label><input type="password" name="password" placeholder="Min. 8 karakter" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" required></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Konfirmasi Password <span class="text-destructive">*</span></label><input type="password" name="password_confirmation" placeholder="Min. 8 karakter" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" required></div></div><div class="flex justify-end mt-4"><button type="submit" class="{{ $buttonClass }} bg-primary text-primary-foreground">{!! $icon('lock') !!} Update Password</button></div></form></div>
    </div>
@elseif ($screen === 'settings')
    <div class="space-y-6">
        <div class="mb-6"><h1>Pengaturan</h1><p class="text-muted-foreground mt-1">Sesuaikan aplikasi sesuai kebutuhan Anda.</p></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-card border border-border rounded-2xl p-6"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">{!! $icon('globe', 'w-5 h-5') !!}</div><div><h4>Umum</h4><p class="text-[11px] text-muted-foreground">Bahasa, mata uang, format</p></div></div><form action="{{ route('catatdulu.settings.preferences') }}" method="POST">@csrf<div class="space-y-4"><div><label class="block text-xs font-semibold text-foreground mb-1.5">Format Tanggal</label><select name="date_format" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option value="DD/MM/YYYY" {{ $user->date_format === 'DD/MM/YYYY' ? 'selected' : '' }}>DD/MM/YYYY</option><option value="MM/DD/YYYY" {{ $user->date_format === 'MM/DD/YYYY' ? 'selected' : '' }}>MM/DD/YYYY</option></select></div><div><label class="block text-xs font-semibold text-foreground mb-1.5">Tema</label><select name="theme" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option value="light" {{ $user->theme === 'light' ? 'selected' : '' }}>Light</option><option value="dark" {{ $user->theme === 'dark' ? 'selected' : '' }}>Dark</option></select></div><button type="submit" class="{{ $buttonClass }} w-full bg-primary text-primary-foreground mt-2">Simpan Preferensi</button></div></form></div>
            <div class="bg-card border border-border rounded-2xl lg:col-span-2 p-6"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">{!! $icon('bell', 'w-5 h-5') !!}</div><div><h4>Preferensi Notifikasi</h4><p class="text-[11px] text-muted-foreground">Atur notifikasi yang Anda terima</p></div></div><div class="space-y-3">@foreach ([['Email notifikasi', 'Update mingguan dan ringkasan bulanan', true], ['Push notification', 'Notifikasi langsung di browser', true], ['Pengingat budget', 'Saat mencapai 80% / 100% budget', true], ['Pengingat tagihan', '3 hari sebelum jatuh tempo', false], ['Tips keuangan mingguan', 'Konten edukatif dari CatatDulu', false]] as [$title, $desc, $checked])@include('catatdulu.partials.toggle-row', compact('title', 'desc', 'checked'))@endforeach</div></div>
            <div class="bg-card border border-border rounded-2xl p-6"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">{!! $icon('shield', 'w-5 h-5') !!}</div><div><h4>Akun</h4><p class="text-[11px] text-muted-foreground">Zona bahaya</p></div></div><div class="space-y-2"><a href="{{ route('catatdulu.reports.exportExcel') }}" class="{{ $buttonClass }} w-full border border-border bg-card hover:bg-muted text-foreground flex justify-center">Export semua data</a><form method="POST" action="{{ route('catatdulu.settings.account') }}" class="m-0" onsubmit="return confirm('Anda yakin ingin menghapus akun permanen?');">@csrf @method('DELETE')<button type="submit" class="{{ $buttonClass }} w-full bg-destructive text-destructive-foreground">Hapus akun permanen</button></form></div></div>
        </div>
    </div>
@elseif ($screen === 'design-system')
    <div class="space-y-6">
        <div class="mb-6"><h1>Design System</h1><p class="text-muted-foreground mt-1">Token, komponen, dan pola yang digunakan di seluruh aplikasi CatatDulu.</p></div>
        <div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-4">Colors</h3><div class="grid grid-cols-2 md:grid-cols-5 gap-3">@foreach ([['Primary', '#1E3A8A'], ['Secondary', '#3B82F6'], ['Success', '#10B981'], ['Danger', '#EF4444'], ['Warning', '#F59E0B'], ['Info', '#3B82F6'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text Primary', '#111827'], ['Text Secondary', '#6B7280']] as [$name, $color])<div class="rounded-xl border border-border overflow-hidden"><div class="h-20" style="background: {{ $color }}"></div><div class="p-3"><div class="text-xs font-semibold">{{ $name }}</div><div class="text-[11px] text-muted-foreground font-mono">{{ $color }}</div></div></div>@endforeach</div></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-4">Buttons</h3><div class="flex flex-wrap gap-3"><button class="{{ $buttonClass }} bg-primary text-primary-foreground">Primary</button><button class="{{ $buttonClass }} bg-secondary text-secondary-foreground">Secondary</button><button class="{{ $buttonClass }} border border-border bg-card">Outline</button><button class="{{ $buttonClass }} hover:bg-muted">Ghost</button><button class="{{ $buttonClass }} bg-[#10B981] text-white">Success</button><button class="{{ $buttonClass }} bg-destructive text-destructive-foreground">Danger</button></div></div><div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-4">Badges</h3><div class="flex flex-wrap gap-2">{!! $badge('Default') !!}{!! $badge('Success', 'success') !!}{!! $badge('Warning', 'warning') !!}{!! $badge('Danger', 'danger') !!}{!! $badge('Info', 'info') !!}{!! $badge('Outline', 'outline') !!}</div></div><div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-4">Inputs</h3><div class="space-y-3"><input placeholder="you@example.com" class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><input placeholder="Cari..." class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><select class="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option>Bulan ini</option></select></div></div><div class="bg-card border border-border rounded-2xl p-6"><h3 class="mb-4">Tables</h3>@include('catatdulu.partials.transaction-table', ['rows' => array_slice($transactions, 0, 3), 'compact' => true, 'fmt' => $fmt, 'badge' => $badge, 'icon' => $icon, 'url' => $url, 'transactionUrl' => $transactionUrl])</div></div>
    </div>
@elseif ($screen === 'empty' || $screen === 'error')
    <div class="space-y-6">
        <div class="mb-6"><h1>{{ $screen === 'empty' ? 'Empty States' : 'Error States' }}</h1><p class="text-muted-foreground mt-1">{{ $screen === 'empty' ? 'Tampilan ketika belum ada data dalam berbagai konteks.' : 'Halaman error untuk berbagai kondisi tidak terduga.' }}</p></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            @php
                $blocks = $screen === 'empty'
                    ? [['inbox', 'Belum ada transaksi', 'Mulai catat pemasukan atau pengeluaran pertama Anda untuk melihatnya di sini.', 'Tambah Transaksi'], ['chart', 'Budget belum dibuat', 'Atur anggaran bulanan agar pengeluaran Anda lebih terkontrol dan terencana.', 'Buat Budget Pertama'], ['bell', 'Tidak ada notifikasi', 'Anda sudah membaca semua notifikasi. Kami akan beri tahu jika ada yang baru.', 'Atur Preferensi'], ['file', 'Belum ada laporan', 'Generate laporan pertama untuk melihat ringkasan keuangan Anda secara menyeluruh.', 'Generate Laporan']]
                    : [['file', '404', 'Halaman tidak ditemukan', 'URL yang Anda tuju tidak ada atau sudah dipindahkan.'], ['alert', '500', 'Server error', 'Terjadi kesalahan di sisi server kami. Mohon coba lagi.'], ['info', '-', 'Tidak ada koneksi', 'Periksa koneksi internet Anda kemudian muat ulang halaman ini.'], ['shield', '401', 'Akses tidak diizinkan', 'Anda perlu masuk ke akun untuk mengakses halaman ini.']];
            @endphp
            @foreach ($blocks as $b)
                @if ($screen === 'empty')
                    <div class="bg-card border border-border rounded-2xl p-10 flex flex-col items-center text-center"><div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-5">{!! $icon($b[0], 'w-10 h-10 text-primary') !!}</div><h3 class="mb-1">{{ $b[1] }}</h3><p class="text-sm text-muted-foreground max-w-sm mb-5">{{ $b[2] }}</p><button class="{{ $buttonClass }} bg-primary text-primary-foreground">{{ $b[3] }}</button></div>
                @else
                    <div class="bg-card border border-border rounded-2xl p-10 flex flex-col items-center text-center"><div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-5">{!! $icon($b[0], 'w-10 h-10 text-red-600') !!}</div><div class="text-5xl font-bold text-primary mb-1">{{ $b[1] }}</div><h3 class="mb-1">{{ $b[2] }}</h3><p class="text-sm text-muted-foreground max-w-sm mb-5">{{ $b[3] }}</p><a href="{{ $url('dashboard') }}" class="{{ $buttonClass }} bg-primary text-primary-foreground">Kembali ke Dashboard</a></div>
                @endif
            @endforeach
        </div>
    </div>
@endif
