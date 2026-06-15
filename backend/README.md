# CataDulu - Financial Management Backend

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4)
![License](https://img.shields.io/badge/License-MIT-green)

Complete production-ready Laravel 12 REST API backend for personal financial management.

## Features

### 💰 Transaction Management
- Create, read, update, delete transactions
- Categorize income and expenses
- Recurring transaction support
- Bulk operations
- Transaction attachments
- Payment method tracking
- Tagging system

### 💼 Budget Management
- Create and manage budgets by period
- Allocate budgets to categories
- Real-time spending tracking
- Budget status monitoring (healthy, moderate, warning, exceeded)
- Automated budget alerts at thresholds
- Budget breakdown by category

### 🎯 Financial Goals
- Set and track financial goals
- Multiple goal types and priorities
- Progress tracking with history
- Projected completion date calculation
- Milestone tracking (25%, 50%, 75%, 100%)
- Savings rate recommendations

### 📊 Analytics & Reporting
- Dashboard statistics
- Monthly spending trends
- Category breakdown analysis
- Spending patterns by payment method and day of week
- Period comparison reports
- Forecast reports
- Export to CSV and PDF

### 🔔 Notifications
- Budget threshold alerts
- Goal milestone notifications
- Transaction reminders
- Customizable notification types

### 👤 User Management
- User authentication with Sanctum tokens
- Profile management
- Password management and reset
- User preferences (currency, theme, date format)
- Subscription management

## Tech Stack

- **Framework**: Laravel 12
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **API**: RESTful with JSON responses
- **Validation**: Form Request Validations
- **Authorization**: Policy-based access control
- **Services**: Business logic layer
- **PDF Export**: Barryvdh/DomPDF

## Installation

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
# Create MySQL database named 'catadulu'
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```

Visit `http://localhost:8000` to access the API.

### Full Setup Guide

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed installation instructions.

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

### Quick API Examples

**Register:**
```bash
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "currency": "USD"
}
```

**Login:**
```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Create Transaction:**
```bash
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "category_id": 1,
  "amount": 50.00,
  "type": "expense",
  "description": "Grocery shopping",
  "transaction_date": "2024-01-15 14:30:00",
  "payment_method": "card"
}
```

## Project Structure

```
backend/
├── app/
│   ├── Models/              # Eloquent models (User, Transaction, Budget, etc.)
│   ├── Http/
│   │   ├── Controllers/     # API controllers
│   │   ├── Requests/        # Form validations
│   │   ├── Resources/       # API resource classes
│   │   └── Middleware/      # Custom middleware
│   ├── Services/            # Business logic
│   ├── Policies/            # Authorization policies
│   └── Exceptions/          # Custom exceptions
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── routes/
│   └── api.php              # API routes
├── config/                  # Configuration files
├── storage/                 # Application storage
├── tests/                   # Test files
├── .env.example             # Environment template
├── composer.json            # PHP dependencies
├── API_DOCUMENTATION.md     # API docs
├── SETUP_GUIDE.md          # Setup instructions
└── README.md               # This file
```

## Database Schema

### Core Tables
- **users** - User accounts with preferences
- **categories** - Income/expense categories
- **transactions** - Financial transactions
- **transaction_attachments** - Transaction files/receipts

### Budget Tables
- **budgets** - Monthly/yearly budgets
- **budget_categories** - Budget allocations per category
- **budget_alerts** - Automated budget alerts

### Goal Tables
- **financial_goals** - Savings/investment goals
- **goal_progress** - Goal progress tracking

### System Tables
- **notifications** - User notifications
- **reports** - Generated reports
- **personal_access_tokens** - API tokens (Sanctum)

## Models & Relationships

### User
- `has_many` Transactions
- `has_many` Categories
- `has_many` Budgets
- `has_many` Goals (FinancialGoal)
- `has_many` Notifications
- `has_many` Reports

### Transaction
- `belongs_to` User
- `belongs_to` Category
- `has_many` TransactionAttachments

### Budget
- `belongs_to` User
- `has_many` BudgetCategories
- `has_many` BudgetAlerts

### FinancialGoal
- `belongs_to` User
- `has_many` GoalProgress

## Controllers

- **AuthController** - Authentication (register, login, logout, password reset)
- **TransactionController** - Transaction CRUD operations
- **CategoryController** - Category management
- **BudgetController** - Budget management and tracking
- **GoalController** - Financial goal management
- **DashboardController** - Dashboard statistics
- **ProfileController** - User profile and preferences
- **AnalyticsController** - Financial analytics and reports
- **ReportController** - Report generation and export
- **NotificationController** - User notifications

## Services

- **TransactionService** - Transaction calculations and aggregations
- **BudgetService** - Budget tracking and alert management
- **GoalService** - Goal progress tracking and milestones
- **AnalyticsService** - Financial analytics and trends
- **ReportService** - Report generation and export

## Key Features

### Authentication & Authorization
- Token-based authentication with Laravel Sanctum
- Policy-based authorization for resources
- User account status verification
- Subscription management

### Data Validation
- Comprehensive form request validation
- Custom validation rules
- Transaction amount validation
- Date range validation
- Currency validation

### Performance
- Database query optimization with eager loading
- Indexed database columns for fast queries
- Pagination for large result sets
- Caching recommendations for frequently accessed data

### Error Handling
- Consistent JSON error responses
- Detailed validation error messages
- HTTP status code compliance
- Exception handling middleware

## API Response Format

### Success Response
```json
{
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field": ["error message"]
  }
}
```

### Paginated Response
```json
{
  "data": [ /* items */ ],
  "links": { /* pagination links */ },
  "meta": { /* pagination metadata */ }
}
```

## Development

### Testing
```bash
# Run tests
php artisan test

# Run with coverage
php artisan test --coverage
```

### Code Quality
```bash
# Format code
./vendor/bin/pint

# Run static analysis
./vendor/bin/phpstan analyse
```

### Debugging
```bash
# Access Tinker REPL
php artisan tinker

# Use xdebug with your IDE
```

## Middleware

- **VerifyUserActive** - Ensures user account is active
- **LogUserActivity** - Logs user API activity
- **CheckSubscription** - Verifies subscription status

## Deployment

### Production Checklist

```bash
# Clean caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize application
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache

# Set production environment
# Update .env with production values
```

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=db-host
DB_DATABASE=catadulu
MAIL_DRIVER=smtp
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- HTTPS-only in production
- SQL injection prevention (Eloquent ORM)
- XSS protection (automatic escaping)
- CSRF protection (tokens)
- Password hashing (bcrypt)
- Secure token storage (Sanctum)

## Performance Tips

1. Use pagination for large datasets
2. Implement result caching
3. Use eager loading (`with()`) to prevent N+1 queries
4. Optimize database indexes
5. Monitor query performance with Laravel Debugbar

## Troubleshooting

### Database Connection Error
```bash
# Update .env with correct database credentials
# Ensure MySQL is running
mysql -u root -p
SHOW DATABASES;
```

### Permission Issues
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Artisan Commands Not Working
```bash
# Clear application cache
php artisan cache:clear
php artisan config:clear
```

## Support

- 📖 [API Documentation](API_DOCUMENTATION.md)
- 📝 [Setup Guide](SETUP_GUIDE.md)
- 🐛 Report issues in repository
- 💬 Contact support@catadulu.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0 (Current)
- Initial release with full feature set
- 11 database models
- 10 API controllers
- 4 business logic services
- Comprehensive API documentation

## Future Enhancements

- [ ] Multi-currency support
- [ ] Bill reminders
- [ ] Investment tracking
- [ ] Expense forecasting
- [ ] Budget collaboration
- [ ] Mobile app integration
- [ ] Advanced reporting
- [ ] AI-powered insights

## Credits

Built with Laravel 12 and modern PHP practices.

---

Made with ❤️ for better financial management
