import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailPhoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final input = _emailPhoneController.text.trim();
      final body = {
        'login': input,
        'password': _passwordController.text,
      };

      final response = await ApiService().post('/login', body); // Fixed endpoint
      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        final token = data['token'];
        if (token != null) {
          await ApiService().saveToken(token);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Login berhasil!')),
            );
            Navigator.pushReplacementNamed(context, '/home');
          }
        } else {
          throw Exception('Token tidak ditemukan dalam response.');
        }
      } else {
        throw Exception(data['message'] ?? 'Login gagal.');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient Mesh
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: theme.primaryColor.withValues(alpha: 0.15),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: theme.colorScheme.secondary.withValues(alpha: 0.1),
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(28.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Premium App Icon Container
                      Center(
                        child: Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: theme.primaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Icon(
                            Icons.wallet_rounded,
                            size: 56,
                            color: theme.primaryColor,
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),
                      Text(
                        'Selamat Datang Kembali',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: theme.primaryColor,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Silakan masuk untuk mengakses laporan keuangan Anda',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      const SizedBox(height: 36),

                      // Email/Phone Field
                      TextFormField(
                        controller: _emailPhoneController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email atau Nomor WhatsApp',
                          prefixIcon: Icon(Icons.mail_outline_rounded),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Masukkan email atau nomor WhatsApp';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 18),

                      // Password Field
                      TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(Icons.lock_outline_rounded),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword 
                                  ? Icons.visibility_outlined 
                                  : Icons.visibility_off_outlined,
                              color: Colors.grey,
                            ),
                            onPressed: () {
                              setState(() => _obscurePassword = !_obscurePassword);
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Masukkan password Anda';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 28),

                      // Login Button
                      ElevatedButton(
                        onPressed: _isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 2,
                          shadowColor: theme.primaryColor.withValues(alpha: 0.4),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 22,
                                width: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                ),
                              )
                            : const Text(
                                'Masuk',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                      const SizedBox(height: 28),

                      // Register Navigation Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Belum memiliki akun? ',
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                          GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(context, '/register');
                            },
                            child: Text(
                              'Daftar Sekarang',
                              style: TextStyle(
                                color: theme.primaryColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
