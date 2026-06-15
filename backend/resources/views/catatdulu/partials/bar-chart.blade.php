<div class="chart-bars">
    @foreach ($rows as $row)
        @php
            $incomeHeight = max(8, round(($row['income'] / $max) * 210));
            $expenseHeight = max(8, round(($row['expense'] / $max) * 210));
        @endphp
        <div class="chart-col">
            <div class="chart-pair">
                <div class="chart-bar" style="height: {{ $incomeHeight }}px; background: {{ $incomeColor }}" title="Income"></div>
                <div class="chart-bar" style="height: {{ $expenseHeight }}px; background: {{ $expenseColor }}" title="Expense"></div>
            </div>
            <span>{{ $row['month'] }}</span>
        </div>
    @endforeach
</div>
