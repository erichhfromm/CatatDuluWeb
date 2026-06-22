import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  bool _isLoading = true;
  List<dynamic> _monthlyTrend = [];
  List<dynamic> _categoryBreakdown = [];

  @override
  void initState() {
    super.initState();
    _fetchAnalyticsData();
  }

  Future<void> _fetchAnalyticsData() async {
    setState(() => _isLoading = true);
    try {
      final trendResponse = await ApiService().get('/analytics/monthly-trend?months=6');
      final breakdownResponse = await ApiService().get('/analytics/category-breakdown?type=expense');

      if (trendResponse.statusCode == 200 && breakdownResponse.statusCode == 200) {
        setState(() {
          _monthlyTrend = jsonDecode(trendResponse.body);
          _categoryBreakdown = jsonDecode(breakdownResponse.body);
          _isLoading = false;
        });
      } else {
        throw Exception('Gagal mengambil data analitik');
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
      appBar: AppBar(title: const Text('Laporan & Analitik')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchAnalyticsData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Title: Monthly Trend
                    const Text(
                      'Tren Keuangan (Pemasukan & Pengeluaran)',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),

                    // Monthly Trend Chart Card
                    if (_monthlyTrend.isEmpty)
                      const Card(
                        child: Padding(
                          padding: EdgeInsets.all(32.0),
                          child: Text('Data tren belum tersedia.', textAlign: TextAlign.center),
                        ),
                      )
                    else
                      Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: SizedBox(
                            height: 200,
                            child: LineChart(
                              LineChartData(
                                gridData: const FlGridData(show: false),
                                titlesData: FlTitlesData(
                                  leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  bottomTitles: AxisTitles(
                                    sideTitles: SideTitles(
                                      showTitles: true,
                                      getTitlesWidget: (value, meta) {
                                        int index = value.toInt();
                                        if (index >= 0 && index < _monthlyTrend.length) {
                                          return Padding(
                                            padding: const EdgeInsets.only(top: 8.0),
                                            child: Text(
                                              _monthlyTrend[index]['month'] ?? '',
                                              style: const TextStyle(fontSize: 10),
                                            ),
                                          );
                                        }
                                        return const Text('');
                                      },
                                    ),
                                  ),
                                ),
                                borderData: FlBorderData(show: false),
                                lineBarsData: [
                                  // Income Line
                                  LineChartBarData(
                                    spots: List.generate(_monthlyTrend.length, (index) {
                                      double income = (_monthlyTrend[index]['income'] ?? 0).toDouble();
                                      return FlSpot(index.toDouble(), income);
                                    }),
                                    isCurved: true,
                                    color: Colors.green,
                                    barWidth: 4,
                                    dotData: const FlDotData(show: true),
                                  ),
                                  // Expense Line
                                  LineChartBarData(
                                    spots: List.generate(_monthlyTrend.length, (index) {
                                      double expense = (_monthlyTrend[index]['expense'] ?? 0).toDouble();
                                      return FlSpot(index.toDouble(), expense);
                                    }),
                                    isCurved: true,
                                    color: Colors.red,
                                    barWidth: 4,
                                    dotData: const FlDotData(show: true),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    const SizedBox(height: 24),

                    // Title: Category Breakdown
                    const Text(
                      'Rincian Pengeluaran Berdasarkan Kategori',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),

                    if (_categoryBreakdown.isEmpty)
                      const Card(
                        child: Padding(
                          padding: EdgeInsets.all(32.0),
                          child: Text('Data pengeluaran kategori belum tersedia.', textAlign: TextAlign.center),
                        ),
                      )
                    else ...[
                      // Pie Chart Card
                      Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: SizedBox(
                            height: 200,
                            child: PieChart(
                              PieChartData(
                                sectionsSpace: 2,
                                centerSpaceRadius: 40,
                                sections: List.generate(_categoryBreakdown.length, (index) {
                                  final item = _categoryBreakdown[index];
                                  final double val = (item['percentage'] ?? 0).toDouble();
                                  final colorHex = item['color']?.replaceAll('#', '0xFF') ?? '0xFF4F46E5';
                                  final parsedColor = Color(int.parse(colorHex));

                                  return PieChartSectionData(
                                    color: parsedColor,
                                    value: val,
                                    title: '${val.toStringAsFixed(0)}%',
                                    radius: 50,
                                    titleStyle: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  );
                                }),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Category Legend
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _categoryBreakdown.length,
                        itemBuilder: (context, index) {
                          final item = _categoryBreakdown[index];
                          final colorHex = item['color']?.replaceAll('#', '0xFF') ?? '0xFF4F46E5';
                          final parsedColor = Color(int.parse(colorHex));
                          final totalAmount = (item['total'] ?? 0).toDouble();

                          return ListTile(
                            leading: Container(
                              width: 16,
                              height: 16,
                              decoration: BoxDecoration(
                                color: parsedColor,
                                shape: BoxShape.circle,
                              ),
                            ),
                            title: Text(item['category_name'] ?? 'Lainnya'),
                            trailing: Text(
                              _formatCurrency(totalAmount),
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          );
                        },
                      ),
                    ],
                  ],
                ),
              ),
            ),
    );
  }
}
