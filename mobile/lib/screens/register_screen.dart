import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final body = {
        'name': _nameController.text.trim(),
        'email': _emailController.text.trim(),
        'phone': _phoneController.text.trim(),
        'password': _passwordController.text,
        'password_confirmation': _confirmPasswordController.text,
        'currency': 'IDR',
      };

      final response = await ApiService().post('/register', body); // Fixed endpoint
      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        if (mounted) {
          final email = _emailController.text.trim();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['message'] ?? 'Pendaftaran berhasil!')),
          );
          Navigator.pushReplacementNamed(
            context,
            '/otp-verify',
            arguments: email,
          );
        }
      } else {
        throw Exception(data['message'] ?? 'Pendaftaran gagal.');
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
      appBar: AppBar(
        title: const Text('Buat Akun Baru'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.primaryColor),
      ),
      extendBodyBehindAppBar: true,
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
                color: theme.primaryColor.withValues(alpha: 0.1),
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
                color: theme.colorScheme.secondary.withValues(alpha: 0.08),
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 28.0, vertical: 16.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Bergabung dengan CataDulu',
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
                        'Kelola laporan keuangan Anda secara real-time dan teratur',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Name Field
                      TextFormField(
                        controller: _nameController,
                        textCapitalization: TextCapitalization.words,
                        decoration: const InputDecoration(
                          labelText: 'Nama Lengkap',
                          prefixIcon: Icon(Icons.person_outline_rounded),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) return 'Nama tidak boleh kosong';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Email Field
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Alamat Email',
                          prefixIcon: Icon(Icons.mail_outline_rounded),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) return 'Email tidak boleh kosong';
                          if (!value.contains('@')) return 'Format email salah';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Phone Field
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(
                          labelText: 'Nomor WhatsApp',
                          prefixIcon: Icon(Icons.phone_iphone_rounded),
                          hintText: 'Contoh: 08123456789',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) return 'Nomor WhatsApp tidak boleh kosong';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

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
                          if (value == null || value.isEmpty) return 'Password tidak boleh kosong';
                          if (value.length < 8) return 'Password minimal 8 karakter';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Confirm Password Field
                      TextFormField(
                        controller: _confirmPasswordController,
                        obscureText: _obscureConfirmPassword,
                        decoration: InputDecoration(
                          labelText: 'Konfirmasi Password',
                          prefixIcon: const Icon(Icons.lock_reset_rounded),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscureConfirmPassword 
                                  ? Icons.visibility_outlined 
                                  : Icons.visibility_off_outlined,
                              color: Colors.grey,
                            ),
                            onPressed: () {
                              setState(() => _obscureConfirmPassword = !_obscureConfirmPassword);
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value != _passwordController.text) return 'Password tidak cocok';
                          return null;
                        },
                      ),
                      const SizedBox(height: 28),

                      // Register Button
                      ElevatedButton(
                        onPressed: _isLoading ? null : _handleRegister,
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
                                'Daftar Akun Baru',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                      const SizedBox(height: 24),

                      // Login Navigation Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Sudah memiliki akun? ',
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                          GestureDetector(
                            onTap: () {
                              Navigator.pop(context);
                            },
                            child: Text(
                              'Masuk Sekarang',
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
