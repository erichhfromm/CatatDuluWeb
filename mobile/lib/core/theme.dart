import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primary = Color(0xFF4F46E5); // indigo-600
  static const Color secondary = Color(0xFF0EA5E9); // sky-500
  static const Color accent = Color(0xFF8B5CF6); // violet-500
  static const Color success = Color(0xFF10B981); // emerald-500
  static const Color warning = Color(0xFFF59E0B); // amber-500
  static const Color danger = Color(0xFFEF4444); // red-500

  // Light Mode Colors
  static const Color lightBg = Color(0xFFF8FAFC); // slate-50
  static const Color lightCard = Colors.white;
  static const Color lightTextPrimary = Color(0xFF0F172A); // slate-900
  static const Color lightTextSecondary = Color(0xFF475569); // slate-600

  // Dark Mode Colors
  static const Color darkBg = Color(0xFF0F172A); // slate-900
  static const Color darkCard = Color(0xFF1E293B); // slate-800
  static const Color darkTextPrimary = Color(0xFFF8FAFC); // slate-50
  static const Color darkTextSecondary = Color(0xFF94A3B8); // slate-400

  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: primary,
      scaffoldBackgroundColor: lightBg,
      cardColor: lightCard,
      textTheme: GoogleFonts.outfitTextTheme().apply(
        bodyColor: lightTextPrimary,
        displayColor: lightTextPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: lightCard,
        elevation: 0,
        iconTheme: IconThemeData(color: lightTextPrimary),
        titleTextStyle: TextStyle(
          color: lightTextPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: lightCard,
        selectedItemColor: primary,
        unselectedItemColor: lightTextSecondary,
      ),
      colorScheme: const ColorScheme.light(
        primary: primary,
        secondary: secondary,
        error: danger,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: primary,
      scaffoldBackgroundColor: darkBg,
      cardColor: darkCard,
      textTheme: GoogleFonts.outfitTextTheme().apply(
        bodyColor: darkTextPrimary,
        displayColor: darkTextPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkCard,
        elevation: 0,
        iconTheme: IconThemeData(color: darkTextPrimary),
        titleTextStyle: TextStyle(
          color: darkTextPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: darkCard,
        selectedItemColor: primary,
        unselectedItemColor: darkTextSecondary,
      ),
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: secondary,
        surface: darkCard,
        error: danger,
      ),
    );
  }
}
