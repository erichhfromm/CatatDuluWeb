class User {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String currency;
  final String dateFormat;
  final String theme;
  final String? profilePicture;
  final String? bio;
  final double totalBalance;
  final double monthlyIncome;
  final double monthlyExpense;
  final Map<String, dynamic> preferences;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.currency,
    required this.dateFormat,
    required this.theme,
    this.profilePicture,
    this.bio,
    required this.totalBalance,
    required this.monthlyIncome,
    required this.monthlyExpense,
    required this.preferences,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      currency: json['currency'] ?? 'IDR',
      dateFormat: json['date_format'] ?? 'Y-m-d',
      theme: json['theme'] ?? 'light',
      profilePicture: json['profile_picture'],
      bio: json['bio'],
      totalBalance: (json['total_balance'] ?? 0).toDouble(),
      monthlyIncome: (json['monthly_income'] ?? 0).toDouble(),
      monthlyExpense: (json['monthly_expense'] ?? 0).toDouble(),
      preferences: Map<String, dynamic>.from(json['preferences'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'currency': currency,
      'date_format': dateFormat,
      'theme': theme,
      'profile_picture': profilePicture,
      'bio': bio,
      'total_balance': totalBalance,
      'monthly_income': monthlyIncome,
      'monthly_expense': monthlyExpense,
      'preferences': preferences,
    };
  }
}
