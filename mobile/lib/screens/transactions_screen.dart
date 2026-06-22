import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/transaction.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  bool _isLoading = true;
  List<Transaction> _transactions = [];
  String _selectedType = 'all'; // 'all', 'income', 'expense'
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    setState(() => _isLoading = true);
    try {
      String path = '/transactions';
      final qs = <String, String>{};
      if (_selectedType != 'all') {
        qs['type'] = _selectedType;
      }
      if (_searchController.text.isNotEmpty) {
        qs['search'] = _searchController.text;
      }

      if (qs.isNotEmpty) {
        final queryStr = Uri(queryParameters: qs).query;
        path = '$path?$queryStr';
      }

      final response = await ApiService().get(path);
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> list = data['data'] ?? [];
        setState(() {
          _transactions = list.map((item) => Transaction.fromJson(item)).toList();
          _isLoading = false;
        });
      } else {
        throw Exception('Gagal mengambil data transaksi');
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
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return format.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Transaksi'),
      ),
      body: Column(
        children: [
          // Filter & Search bar
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Cari transaksi...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                    onSubmitted: (_) => _fetchTransactions(),
                  ),
                ),
                const SizedBox(width: 8),
                DropdownButton<String>(
                  value: _selectedType,
                  items: const [
                    DropdownMenuItem(value: 'all', child: Text('Semua')),
                    DropdownMenuItem(value: 'income', child: Text('Masuk')),
                    DropdownMenuItem(value: 'expense', child: Text('Keluar')),
                  ],
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _selectedType = val;
                      });
                      _fetchTransactions();
                    }
                  },
                ),
              ],
            ),
          ),

          // Transactions List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _fetchTransactions,
                    child: _transactions.isEmpty
                        ? const Center(child: Text('Tidak ada transaksi ditemukan.'))
                        : ListView.separated(
                            itemCount: _transactions.length,
                            separatorBuilder: (context, index) => const Divider(),
                            itemBuilder: (context, index) {
                              final tx = _transactions[index];
                              final isIncome = tx.type == 'income';

                              return ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: isIncome ? Colors.green.shade50 : Colors.red.shade50,
                                  child: Icon(
                                    isIncome ? Icons.arrow_downward : Icons.arrow_upward,
                                    color: isIncome ? Colors.green : Colors.red,
                                  ),
                                ),
                                title: Text(
                                  tx.description.isNotEmpty ? tx.description : tx.category.name,
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Text(
                                  tx.transactionDate,
                                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                                ),
                                trailing: Text(
                                  '${isIncome ? '+' : '-'}${_formatCurrency(tx.amount)}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: isIncome ? Colors.green : Colors.red,
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}
