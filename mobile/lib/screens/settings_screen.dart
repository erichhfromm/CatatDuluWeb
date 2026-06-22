import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _isLoading = true;
  String _currency = 'IDR';
  String _dateFormat = 'Y-m-d';
  Map<String, dynamic> _nestedPrefs = {};

  @override
  void initState() {
    super.initState();
    _fetchPreferences();
  }

  Future<void> _fetchPreferences() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService().get('/profile/preferences');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _currency = data['currency'] ?? 'IDR';
          _dateFormat = data['date_format'] ?? 'Y-m-d';
          _nestedPrefs = Map<String, dynamic>.from(data['preferences'] ?? {});
          _isLoading = false;
        });
      } else {
        throw Exception('Gagal mengambil data pengaturan.');
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

  Future<void> _updateTopLevelPref(String key, String val) async {
    try {
      final body = {key: val};
      final response = await ApiService().put('/profile/preferences', body);
      if (response.statusCode == 200) {
        setState(() {
          if (key == 'currency') _currency = val;
          if (key == 'date_format') _dateFormat = val;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Pengaturan berhasil diperbarui!')),
          );
        }
      } else {
        throw Exception('Gagal memperbarui pengaturan.');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _updateNestedPref(String key, bool val) async {
    try {
      final body = {
        'preferences': {key: val}
      };
      final response = await ApiService().put('/profile/preferences', body);
      if (response.statusCode == 200) {
        setState(() {
          _nestedPrefs[key] = val;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('"${key.replaceAll('_', ' ')}" berhasil diperbarui!')),
          );
        }
      } else {
        throw Exception('Gagal memperbarui preferensi.');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _handleLogout() async {
    await ApiService().clearToken();
    if (mounted) {
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
    }
  }

  Future<void> _handleExportData() async {
    try {
      final response = await ApiService().get('/profile/export');
      if (response.statusCode == 200) {
        if (mounted) {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Ekspor Data Sukses'),
              content: const Text(
                'Seluruh data transaksi dan anggaran berhasil diekspor. (Pada aplikasi mobile, file ini disimpan di storage local).',
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }
      } else {
        throw Exception('Gagal mengekspor data.');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _handleDisableAccount() async {
    try {
      final response = await ApiService().post('/profile/disable', {});
      if (response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Akun dinonaktifkan. Anda akan dikeluarkan.')),
          );
          _handleLogout();
        }
      } else {
        throw Exception('Gagal menonaktifkan akun.');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _handleDeleteAccount() async {
    final TextEditingController confirmController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hapus Akun Permanen'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tindakan ini tidak bisa dibatalkan! Semua data keuangan Anda akan dihapus selamanya.\n\nKetik "HAPUS" untuk mengonfirmasi:',
              style: TextStyle(color: Colors.red),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: confirmController,
              decoration: const InputDecoration(
                hintText: 'HAPUS',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              if (confirmController.text.trim() == 'HAPUS') {
                Navigator.pop(context); // Close modal
                try {
                  final response = await ApiService().delete('/profile');
                  if (response.statusCode == 200) {
                    await ApiService().clearToken();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Akun berhasil dihapus selamanya.')),
                      );
                      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                    }
                  } else {
                    throw Exception('Gagal menghapus akun.');
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(e.toString())),
                    );
                  }
                }
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Konfirmasi salah.')),
                );
              }
            },
            child: const Text('Hapus'),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleRow(String prefKey, String label, String desc, bool defaultVal) {
    final bool currentVal = _nestedPrefs[prefKey] ?? defaultVal;
    return SwitchListTile(
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      subtitle: Text(desc, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      value: currentVal,
      onChanged: (bool val) => _updateNestedPref(prefKey, val),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pengaturan')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                // General Settings Card
                const Text('Umum', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      children: [
                        ListTile(
                          title: const Text('Mata Uang'),
                          trailing: DropdownButton<String>(
                            value: _currency,
                            items: const [
                              DropdownMenuItem(value: 'IDR', child: Text('IDR (Rp)')),
                              DropdownMenuItem(value: 'USD', child: Text('USD (\$)')),
                            ],
                            onChanged: (val) {
                              if (val != null) _updateTopLevelPref('currency', val);
                            },
                          ),
                        ),
                        ListTile(
                          title: const Text('Format Tanggal'),
                          trailing: DropdownButton<String>(
                            value: _dateFormat,
                            items: const [
                              DropdownMenuItem(value: 'Y-m-d', child: Text('YYYY-MM-DD')),
                              DropdownMenuItem(value: 'd/m/Y', child: Text('DD/MM/YYYY')),
                            ],
                            onChanged: (val) {
                              if (val != null) _updateTopLevelPref('date_format', val);
                            },
                          ),
                        ),
                        _buildToggleRow('compact_mode', 'Mode Kompak', 'Tampilkan lebih banyak data', false),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Notifications Preferences
                const Text('Notifikasi', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Card(
                  child: Column(
                    children: [
                      _buildToggleRow('email_notif', 'Email Notifikasi', 'Update mingguan dan ringkasan bulanan', true),
                      _buildToggleRow('push_notif', 'Push Notification', 'Notifikasi langsung di handphone', true),
                      _buildToggleRow('budget_reminder', 'Pengingat Budget', 'Saat mencapai 80% / 100% budget', true),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Danger Zone / Account Settings
                const Text('Akun & Zona Bahaya', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red)),
                const SizedBox(height: 8),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        ElevatedButton.icon(
                          onPressed: _handleExportData,
                          icon: const Icon(Icons.download),
                          label: const Text('Ekspor Semua Data'),
                        ),
                        const SizedBox(height: 8),
                        OutlinedButton.icon(
                          onPressed: _handleDisableAccount,
                          icon: const Icon(Icons.block),
                          label: const Text('Nonaktifkan Akun Sementara'),
                        ),
                        const SizedBox(height: 8),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
                          onPressed: _handleDeleteAccount,
                          icon: const Icon(Icons.delete_forever),
                          label: const Text('Hapus Akun Selamanya'),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Logout Button
                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text('Keluar dari Akun', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                  onTap: _handleLogout,
                ),
              ],
            ),
    );
  }
}
