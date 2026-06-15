# CataDulu Backend - Installation & Setup Guide

## Project Structure

```
backend/
├── app/
│   ├── Models/              # Eloquent models
│   ├── Http/
│   │   ├── Controllers/     # API controllers
│   │   ├── Requests/        # Form request validations
│   │   ├── Resources/       # API resources
│   │   └── Middleware/      # Custom middleware
│   ├── Services/            # Business logic services
│   ├── Policies/            # Authorization policies
│   └── Exceptions/          # Custom exceptions
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── routes/
│   └── api.php              # API routes
├── config/                  # Configuration files
├── storage/                 # Application storage
├── public/                  # Public assets
├── tests/                   # Test files
├── .env.example             # Environment example
├── composer.json            # PHP dependencies
└── README.md               # This file
```

## Installation Steps

### 1. Prerequisites

Ensure you have the following installed:
- PHP 8.2 or higher
- MySQL 8.0 or higher
- Composer
- Git

### 2. Clone Repository

```bash
git clone <repository-url>
cd backend
```

### 3. Install PHP Dependencies

```bash
composer install
```

### 4. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` file with your database configuration:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=catadulu
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Create Database

```bash
# Using MySQL command line
mysql -u root -p
CREATE DATABASE catadulu;
exit;
```

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. Seed Database (Optional - for test data)

```bash
php artisan db:seed
```

### 8. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Configuration

### Key Configuration Files

#### `config/app.php`
- Application name, locale, timezone
- Service providers

#### `config/database.php`
- Database connections
- Migration paths

#### `config/sanctum.php`
- API token settings
- Expiration times

#### `.env`
- Database credentials
- Mail settings
- Cache configuration

## Database Migrations

All tables are created through migrations. Run migrations in order:

```bash
php artisan migrate
```

Key tables created:
- `users` - User accounts
- `categories` - Transaction categories
- `transactions` - Financial transactions
- `transaction_attachments` - Transaction documents
- `budgets` - Monthly/yearly budgets
- `budget_categories` - Budget allocations
- `financial_goals` - Savings goals
- `goal_progress` - Goal progress tracking
- `notifications` - User notifications
- `budget_alerts` - Budget threshold alerts
- `reports` - Generated reports

## Seeding Sample Data

Run seeders to populate the database with sample data:

```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=UserSeeder
```

Sample data includes:
- 1 test user + 5 generated users
- Default income & expense categories
- Sample transactions
- Sample budgets
- Sample financial goals

## Development

### Running Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/TransactionTest.php

# Run with coverage
php artisan test --coverage
```

### Running Code Quality Tools

```bash
# Format code with Pint
./vendor/bin/pint

# Check code quality
./vendor/bin/phpstan analyse

# Run linter
./vendor/bin/phpunit --testdox
```

### Tinker REPL

```bash
php artisan tinker

# Example commands
>>> $user = User::first();
>>> $user->transactions()->count();
>>> $user->total_balance;
```

## API Usage Examples

### Register New User

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "password_confirmation": "SecurePassword123",
    "currency": "USD"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Create Transaction

```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category_id": 1,
    "amount": 50.00,
    "type": "expense",
    "description": "Grocery shopping",
    "transaction_date": "2024-01-15 14:30:00",
    "payment_method": "card"
  }'
```

## Troubleshooting

### Common Issues

#### "The application has encountered an error."
- Check `.env` configuration
- Run `php artisan config:clear`
- Check Laravel logs: `storage/logs/`

#### Database connection error
- Verify database credentials in `.env`
- Ensure MySQL is running
- Check database exists: `SHOW DATABASES;`

#### Permission denied errors
- Fix storage permissions: `sudo chown -R www-data:www-data storage bootstrap/cache`
- Or: `chmod -R 775 storage bootstrap/cache`

#### Missing environment file
- Copy `.env.example` to `.env`
- Generate key: `php artisan key:generate`

## Production Deployment

### Pre-deployment Checklist

```bash
# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
```

### Environment Variables for Production

```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=production-db-host
DB_DATABASE=catadulu_prod
DB_USERNAME=prod_user
DB_PASSWORD=strong_password
```

### Server Requirements

- PHP 8.2+
- MySQL 8.0+
- Nginx or Apache
- SSL certificate
- Sufficient disk space for uploads

## Performance Optimization

### Caching

```php
// Cache queries
$categories = cache()->remember('user_categories', 3600, function () {
    return auth()->user()->categories()->get();
});
```

### Query Optimization

- Use eager loading: `with('category')`
- Use indexes on frequently queried columns
- Paginate large result sets

### Database Indexes

All foreign keys and frequently searched columns are indexed in migrations.

## API Rate Limiting

Configure in `kernel.php`:

```php
Route::middleware(['throttle:60,1'])->group(function () {
    // Rate limited routes
});
```

## Security

### CORS Configuration

Edit `.env` to allow frontend domain:
```env
FRONTEND_URL=http://localhost:3000
```

### API Token Security

- Tokens expire after inactivity
- Use HTTPS in production
- Never log sensitive data
- Implement proper authorization checks

## Support & Documentation

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Laravel Documentation**: https://laravel.com/docs
- **Eloquent ORM**: https://laravel.com/docs/eloquent

## License

MIT License - See LICENSE file for details
