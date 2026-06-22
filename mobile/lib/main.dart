import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/otp_screen.dart';
import 'screens/main_layout.dart';
import 'screens/notifications_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CataDulu Mobile',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system, // Uses system settings (supports Light/Dark mode)
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/otp-verify': (context) => const OtpScreen(),
        '/home': (context) => const MainLayout(),
        '/notifications': (context) => const NotificationsScreen(),
      },
      builder: (context, child) {
        return LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth > 600) {
              return Scaffold(
                backgroundColor: const Color(0xFF0F172A), // Slate 900
                body: Center(
                  child: Container(
                    width: 420,
                    height: 850,
                    margin: const EdgeInsets.symmetric(vertical: 24),
                    decoration: BoxDecoration(
                      color: Theme.of(context).scaffoldBackgroundColor,
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.3),
                          blurRadius: 24,
                          offset: const Offset(0, 12),
                        ),
                      ],
                      border: Border.all(
                        color: Colors.grey.withValues(alpha: 0.2),
                        width: 4,
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(28),
                      child: child,
                    ),
                  ),
                ),
              );
            }
            return child!;
          },
        );
      },
    );
  }
}
