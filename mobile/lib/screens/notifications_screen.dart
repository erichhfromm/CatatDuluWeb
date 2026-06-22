import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/notification.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _isLoading = true;
  List<AppNotification> _notifications = [];

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  Future<void> _fetchNotifications() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService().get('/notifications');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> list = data['data'] ?? [];
        setState(() {
          _notifications = list.map((item) => AppNotification.fromJson(item)).toList();
          _isLoading = false;
        });
      } else {
        throw Exception('Gagal mengambil data notifikasi');
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

  Future<void> _markAsRead(int id) async {
    try {
      final response = await ApiService().put('/notifications/$id/read', {});
      if (response.statusCode == 200) {
        setState(() {
          _notifications = _notifications.map((n) {
            if (n.id == id) {
              return AppNotification(
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                isRead: true,
                createdAt: n.createdAt,
              );
            }
            return n;
          }).toList();
        });
      }
    } catch (e) {
      // Quiet fail
    }
  }

  Future<void> _deleteNotification(int id) async {
    try {
      final response = await ApiService().delete('/notifications/$id');
      if (response.statusCode == 200) {
        setState(() {
          _notifications = _notifications.where((n) => n.id != id).toList();
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Notifikasi dihapus.')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _markAllAsRead() async {
    try {
      final response = await ApiService().post('/notifications/read-all', {});
      if (response.statusCode == 200) {
        setState(() {
          _notifications = _notifications.map((n) {
            return AppNotification(
              id: n.id,
              title: n.title,
              message: n.message,
              type: n.type,
              isRead: true,
              createdAt: n.createdAt,
            );
          }).toList();
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Semua notifikasi ditandai dibaca.')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _deleteAll() async {
    try {
      final response = await ApiService().delete('/notifications');
      if (response.statusCode == 200) {
        setState(() {
          _notifications = [];
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Semua notifikasi dihapus.')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifikasi'),
        actions: [
          if (_notifications.isNotEmpty)
            PopupMenuButton<String>(
              onSelected: (val) {
                if (val == 'read_all') {
                  _markAllAsRead();
                } else if (val == 'delete_all') {
                  _deleteAll();
                }
              },
              itemBuilder: (context) => const [
                PopupMenuItem(value: 'read_all', child: Text('Tandai Semua Dibaca')),
                PopupMenuItem(value: 'delete_all', child: Text('Hapus Semua')),
              ],
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchNotifications,
              child: _notifications.isEmpty
                  ? const Center(child: Text('Tidak ada notifikasi.'))
                  : ListView.builder(
                      itemCount: _notifications.length,
                      itemBuilder: (context, index) {
                        final n = _notifications[index];
                        return Dismissible(
                          key: Key(n.id.toString()),
                          background: Container(
                            color: Colors.red,
                            alignment: Alignment.centerRight,
                            padding: const EdgeInsets.only(right: 20),
                            child: const Icon(Icons.delete, color: Colors.white),
                          ),
                          onDismissed: (direction) => _deleteNotification(n.id),
                          child: ListTile(
                            onTap: () {
                              if (!n.isRead) {
                                _markAsRead(n.id);
                              }
                            },
                            leading: Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: n.isRead ? Colors.transparent : Colors.blue,
                                shape: BoxShape.circle,
                              ),
                            ),
                            title: Text(
                              n.title,
                              style: TextStyle(
                                fontWeight: n.isRead ? FontWeight.normal : FontWeight.bold,
                              ),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 4),
                                Text(n.message),
                                const SizedBox(height: 4),
                                Text(
                                  n.createdAt,
                                  style: const TextStyle(fontSize: 10, color: Colors.grey),
                                ),
                              ],
                            ),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete_outline, color: Colors.grey),
                              onPressed: () => _deleteNotification(n.id),
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
