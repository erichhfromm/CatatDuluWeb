class TransactionCategory {
  final int id;
  final String name;
  final String? color;
  final String type;

  TransactionCategory({
    required this.id,
    required this.name,
    this.color,
    required this.type,
  });

  factory TransactionCategory.fromJson(Map<String, dynamic> json) {
    return TransactionCategory(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      color: json['color'],
      type: json['type'] ?? 'expense',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'color': color,
      'type': type,
    };
  }
}

class Transaction {
  final int id;
  final String type; // 'income' | 'expense'
  final double amount;
  final String description;
  final String? notes;
  final int categoryId;
  final TransactionCategory category;
  final String paymentMethod;
  final String transactionDate;
  final String status;

  Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.description,
    this.notes,
    required this.categoryId,
    required this.category,
    required this.paymentMethod,
    required this.transactionDate,
    required this.status,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? 0,
      type: json['type'] ?? 'expense',
      amount: (json['amount'] ?? 0).toDouble(),
      description: json['description'] ?? '',
      notes: json['notes'],
      categoryId: json['category_id'] ?? 0,
      category: TransactionCategory.fromJson(json['category'] ?? {}),
      paymentMethod: json['payment_method'] ?? 'cash',
      transactionDate: json['transaction_date'] ?? '',
      status: json['status'] ?? 'completed',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'amount': amount,
      'description': description,
      'notes': notes,
      'category_id': categoryId,
      'category': category.toJson(),
      'payment_method': paymentMethod,
      'transaction_date': transactionDate,
      'status': status,
    };
  }
}
