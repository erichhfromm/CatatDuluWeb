import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  double _totalBalance = 0;
  double _monthlyIncome = 0;
  double _monthlyExpense = 0;
  String _userName = 'Pengguna';
  String _currency = 'IDR';
  List<dynamic> _recentTransactions = [];

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    setState(() => _isLoading = true);
    try {
      final statsResponse = await ApiService().get('/dashboard/stats');
      final txResponse = await ApiService().get('/dashboard/recent-transactions?limit=5');

      if (statsResponse.statusCode == 200 && txResponse.statusCode == 200) {
        final statsData = jsonDecode(statsResponse.body);
        final txData = jsonDecode(txResponse.body);

        setState(() {
          _totalBalance = (statsData['balance']['total'] ?? 0).toDouble();
          _monthlyIncome = (statsData['balance']['monthly_income'] ?? 0).toDouble();
          _monthlyExpense = (statsData['balance']['monthly_expense'] ?? 0).toDouble();
          _userName = statsData['user']['name'] ?? 'Pengguna';
          _currency = statsData['user']['currency'] ?? 'IDR';
          _recentTransactions = txData['transactions'] ?? [];
          _isLoading = false;
        });
      } else {
        throw Exception('Gagal mengambil data dasbor');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
        );
        setState(() => _isLoading = false);
      }
    }
  }

  String _formatCurrency(double amount) {
    final format = NumberFormat.currency(
      locale: 'id_ID',
      symbol: _currency == 'IDR' ? 'Rp ' : '$_currency ',
      decimalDigits: 0,
    );
    return format.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: theme.primaryColor.withValues(alpha: 0.1),
              child: Text(
                _userName.isNotEmpty ? _userName[0].toUpperCase() : 'U',
                style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Selamat datang,', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text(
                    _userName,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchDashboardData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Premium Balance Card with Gradients & Card Mockup styling
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [theme.primaryColor, theme.primaryColor.withValues(alpha: 0.8)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: theme.primaryColor.withValues(alpha: 0.35),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Stack(
                        children: [
                          Positioned(
                            right: -50,
                            top: -50,
                            child: Container(
                              width: 180,
                              height: 180,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withValues(alpha: 0.08),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text(
                                      'Total Saldo',
                                      style: TextStyle(color: Colors.white70, fontSize: 14),
                                    ),
                                    Icon(
                                      Icons.account_balance_wallet_rounded,
                                      color: Colors.white.withValues(alpha: 0.6),
                                      size: 28,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _formatCurrency(_totalBalance),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: -1,
                                  ),
                                ),
                                const SizedBox(height: 32),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    // Income Block
                                    Expanded(
                                      child: Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              color: Colors.white.withValues(alpha: 0.15),
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(
                                              Icons.arrow_downward_rounded,
                                              color: Colors.greenAccent,
                                              size: 18,
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                const Text('Pemasukan', style: TextStyle(color: Colors.white70, fontSize: 11)),
                                                const SizedBox(height: 2),
                                                Text(
                                                  _formatCurrency(_monthlyIncome),
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 14,
                                                  ),
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    // Divider line
                                    Container(
                                      height: 30,
                                      width: 1,
                                      color: Colors.white24,
                                      margin: const EdgeInsets.symmetric(horizontal: 16),
                                    ),
                                    // Expense Block
                                    Expanded(
                                      child: Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              color: Colors.white.withValues(alpha: 0.15),
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(
                                              Icons.arrow_upward_rounded,
                                              color: Colors.redAccent,
                                              size: 18,
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                const Text('Pengeluaran', style: TextStyle(color: Colors.white70, fontSize: 11)),
                                                const SizedBox(height: 2),
                                                Text(
                                                  _formatCurrency(_monthlyExpense),
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 14,
                                                  ),
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Quick Actions Section
                    const Text(
                      'Kelola Keuangan',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              // Action to add income
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Ink(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              decoration: BoxDecoration(
                                color: Colors.green.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.green.withValues(alpha: 0.2)),
                              ),
                              child: Column(
                                children: [
                                  const Icon(Icons.add_box_rounded, color: Colors.green, size: 28),
                                  const SizedBox(height: 6),
                                  Text(
                                    'Pemasukan',
                                    style: TextStyle(color: Colors.green.shade800, fontWeight: FontWeight.w600, fontSize: 13),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              // Action to add expense
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Ink(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              decoration: BoxDecoration(
                                color: Colors.red.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                              ),
                              child: Column(
                                children: [
                                  const Icon(Icons.indeterminate_check_box_rounded, color: Colors.red, size: 28),
                                  const SizedBox(height: 6),
                                  Text(
                                    'Pengeluaran',
                                    style: TextStyle(color: Colors.red.shade800, fontWeight: FontWeight.w600, fontSize: 13),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Recent Transactions Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Transaksi Terbaru',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        TextButton.icon(
                          onPressed: () {
                            // Link to transaction tab or navigate
                          },
                          icon: const Icon(Icons.chevron_right_rounded, size: 18),
                          label: const Text('Semua'),
                          style: TextButton.styleFrom(
                            foregroundColor: theme.primaryColor,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    if (_recentTransactions.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(32.0),
                        decoration: BoxDecoration(
                          color: Colors.grey.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            Icon(Icons.receipt_long_outlined, size: 40, color: Colors.grey.shade400),
                            const SizedBox(height: 8),
                            const Text(
                              'Belum ada transaksi bulan ini.',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      )
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _recentTransactions.length,
                        separatorBuilder: (context, index) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final tx = _recentTransactions[index];
                          final isIncome = tx['type'] == 'income';
                          final categoryName = tx['category']?['name'] ?? 'Lainnya';
                          final amount = (tx['amount'] ?? 0).toDouble();

                          return Container(
                            decoration: BoxDecoration(
                              color: theme.cardColor,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.02),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              leading: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: isIncome ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  isIncome ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                                  color: isIncome ? Colors.green : Colors.red,
                                  size: 20,
                                ),
                              ),
                              title: Text(
                                tx['description'] ?? categoryName,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              subtitle: Text(
                                tx['transaction_date'] ?? '',
                                style: const TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                              trailing: Text(
                                '${isIncome ? '+' : '-'}${_formatCurrency(amount)}',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                  color: isIncome ? Colors.green : Colors.red,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),
    );
  }
}
