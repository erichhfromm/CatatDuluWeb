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
    return Scaffold(
      appBar: AppBar(
        title: Text('Halo, $_userName 👋'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchDashboardData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Main Balance Card
                    Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      color: Theme.of(context).primaryColor,
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Total Saldo',
                              style: TextStyle(color: Colors.white70, fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _formatCurrency(_totalBalance),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Row(
                                      children: [
                                        Icon(Icons.arrow_downward, color: Colors.greenAccent, size: 16),
                                        SizedBox(width: 4),
                                        Text('Pemasukan', style: TextStyle(color: Colors.white70, fontSize: 12)),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _formatCurrency(_monthlyIncome),
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Row(
                                      children: [
                                        Icon(Icons.arrow_upward, color: Colors.redAccent, size: 16),
                                        SizedBox(width: 4),
                                        Text('Pengeluaran', style: TextStyle(color: Colors.white70, fontSize: 12)),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _formatCurrency(_monthlyExpense),
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Quick Actions
                    const Text(
                      'Aksi Cepat',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // Navigate to add income screen
                            },
                            icon: const Icon(Icons.add),
                            label: const Text('Pemasukan'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // Navigate to add expense screen
                            },
                            icon: const Icon(Icons.remove),
                            label: const Text('Pengeluaran'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Recent Transactions List
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Transaksi Terbaru',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        TextButton(
                          onPressed: () {
                            // Can change bottom navigation index to Transactions page
                          },
                          child: const Text('Lihat Semua'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    if (_recentTransactions.isEmpty)
                      const Card(
                        child: Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text(
                            'Belum ada transaksi.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                      )
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _recentTransactions.length,
                        separatorBuilder: (context, index) => const Divider(),
                        itemBuilder: (context, index) {
                          final tx = _recentTransactions[index];
                          final isIncome = tx['type'] == 'income';
                          final categoryName = tx['category']?['name'] ?? 'Lainnya';
                          final amount = (tx['amount'] ?? 0).toDouble();

                          return ListTile(
                            leading: CircleAvatar(
                              backgroundColor: isIncome ? Colors.green.shade50 : Colors.red.shade50,
                              child: Icon(
                                isIncome ? Icons.arrow_downward : Icons.arrow_upward,
                                color: isIncome ? Colors.green : Colors.red,
                              ),
                            ),
                            title: Text(
                              tx['description'] ?? categoryName,
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            subtitle: Text(
                              tx['transaction_date'] ?? '',
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                            trailing: Text(
                              '${isIncome ? '+' : '-'}${_formatCurrency(amount)}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isIncome ? Colors.green : Colors.red,
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
