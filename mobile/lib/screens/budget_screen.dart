import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/budget.dart';

class BudgetScreen extends StatefulWidget {
  const BudgetScreen({super.key});

  @override
  State<BudgetScreen> createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  bool _isLoading = true;
  List<Budget> _budgets = [];

  @override
  void initState() {
    super.initState();
    _fetchBudgets();
  }

  Future<void> _fetchBudgets() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService().get('/budgets');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> list = data['data'] ?? [];
        setState(() {
          _budgets = list.map((item) => Budget.fromJson(item)).toList();
          _isLoading = false;
        });
      } else {
        throw Exception('Gagal mengambil data anggaran');
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
        title: const Text('Anggaran Bulanan'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchBudgets,
              child: _budgets.isEmpty
                  ? const Center(child: Text('Belum ada anggaran dibuat.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: _budgets.length,
                      itemBuilder: (context, index) {
                        final b = _budgets[index];
                        final double usageRatio = b.percentageUsed / 100.0;
                        final colorHex = b.color?.replaceAll('#', '0xFF') ?? '0xFF4F46E5';
                        final parsedColor = Color(int.parse(colorHex));

                        return Card(
                          margin: const EdgeInsets.only(bottom: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 2,
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      b.name,
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Container(
                                      width: 12,
                                      height: 12,
                                      decoration: BoxDecoration(
                                        color: parsedColor,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Periode: ${b.startDate} s/d ${b.endDate}',
                                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Terpakai: ${_formatCurrency(b.spentAmount)}',
                                      style: const TextStyle(fontWeight: FontWeight.w600),
                                    ),
                                    Text(
                                      'Batas: ${_formatCurrency(b.amount)}',
                                      style: const TextStyle(color: Colors.grey),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                LinearProgressIndicator(
                                  value: usageRatio > 1.0 ? 1.0 : usageRatio,
                                  backgroundColor: Colors.grey.shade200,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    usageRatio >= 1.0
                                        ? Colors.red
                                        : usageRatio >= 0.8
                                            ? Colors.orange
                                            : parsedColor,
                                  ),
                                  minHeight: 8,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      '${b.percentageUsed.toStringAsFixed(0)}% terpakai',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: usageRatio >= 1.0 ? Colors.red : Colors.grey,
                                        fontWeight: usageRatio >= 1.0 ? FontWeight.bold : FontWeight.normal,
                                      ),
                                    ),
                                    Text(
                                      'Sisa: ${_formatCurrency(b.remainingAmount)}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: b.remainingAmount < 0 ? Colors.red : Colors.green,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
