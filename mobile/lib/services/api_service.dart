import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_config.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  static const String _tokenKey = 'api_token';

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  Map<String, String> _headers(String? token, {bool isMultipart = false}) {
    final headers = <String, String>{
      'Accept': 'application/json',
    };
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  Future<http.Response> get(String path) async {
    final token = await getToken();
    final url = Uri.parse('${ApiConfig.baseUrl}$path');
    final response = await http.get(url, headers: _headers(token));
    _handleUnauthorized(response);
    return response;
  }

  Future<http.Response> post(String path, dynamic body) async {
    final token = await getToken();
    final url = Uri.parse('${ApiConfig.baseUrl}$path');
    final response = await http.post(
      url,
      headers: _headers(token),
      body: jsonEncode(body),
    );
    _handleUnauthorized(response);
    return response;
  }

  Future<http.Response> put(String path, dynamic body) async {
    final token = await getToken();
    final url = Uri.parse('${ApiConfig.baseUrl}$path');
    final response = await http.put(
      url,
      headers: _headers(token),
      body: jsonEncode(body),
    );
    _handleUnauthorized(response);
    return response;
  }

  Future<http.Response> delete(String path) async {
    final token = await getToken();
    final url = Uri.parse('${ApiConfig.baseUrl}$path');
    final response = await http.delete(url, headers: _headers(token));
    _handleUnauthorized(response);
    return response;
  }

  void _handleUnauthorized(http.Response response) {
    if (response.statusCode == 401) {
      clearToken();
      // In a real application, you might want to trigger a redirect to login screen
    }
  }
}
