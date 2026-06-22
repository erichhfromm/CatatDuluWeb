import 'transaction.dart';

class BudgetCategory {
  final int id;
  final int categoryId;
  final double allocatedAmount;
  final TransactionCategory category;

  BudgetCategory({
    required this.id,
    required this.categoryId,
    required this.allocatedAmount,
    required this.category,
  });

  factory BudgetCategory.fromJson(Map<String, dynamic> json) {
    return BudgetCategory(
      id: json['id'] ?? 0,
      categoryId: json['category_id'] ?? 0,
      allocatedAmount: (json['allocated_amount'] ?? 0).toDouble(),
      category: TransactionCategory.fromJson(json['category'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category_id': categoryId,
      'allocated_amount': allocatedAmount,
      'category': category.toJson(),
    };
  }
}

class Budget {
  final int id;
  final String name;
  final String? description;
  final double amount;
  final String period;
  final String startDate;
  final String endDate;
  final bool isActive;
  final String? color;
  final double spentAmount;
  final double remainingAmount;
  final double percentageUsed;
  final List<BudgetCategory> categories;

  Budget({
    required this.id,
    required this.name,
    this.description,
    required this.amount,
    required this.period,
    required this.startDate,
    required this.endDate,
    required this.isActive,
    this.color,
    required this.spentAmount,
    required this.remainingAmount,
    required this.percentageUsed,
    required this.categories,
  });

  factory Budget.fromJson(Map<String, dynamic> json) {
    var catsList = json['categories'] as List? ?? [];
    List<BudgetCategory> parsedCats = catsList.map((c) => BudgetCategory.fromJson(c)).toList();

    return Budget(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
      amount: (json['amount'] ?? 0).toDouble(),
      period: json['period'] ?? 'monthly',
      startDate: json['start_date'] ?? '',
      endDate: json['end_date'] ?? '',
      isActive: json['is_active'] ?? true,
      color: json['color'],
      spentAmount: (json['spent_amount'] ?? 0).toDouble(),
      remainingAmount: (json['remaining_amount'] ?? 0).toDouble(),
      percentageUsed: (json['percentage_used'] ?? 0).toDouble(),
      categories: parsedCats,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'amount': amount,
      'period': period,
      'start_date': startDate,
      'end_date': endDate,
      'is_active': isActive,
      'color': color,
      'spent_amount': spentAmount,
      'remaining_amount': remainingAmount,
      'percentage_used': percentageUsed,
      'categories': categories.map((c) => c.toJson()).toList(),
    };
  }
}
