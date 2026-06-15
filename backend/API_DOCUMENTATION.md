# CataDulu Backend API Documentation

## Overview

CataDulu is a comprehensive financial management application backend built with Laravel 12. It provides a complete REST API for managing personal finances with features including transactions, budgets, financial goals, and analytics.

## Getting Started

### Prerequisites

- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js (for frontend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Setup database**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Start development server**
   ```bash
   php artisan serve
   ```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/register`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "email@example.com",
    "password": "string",
    "password_confirmation": "string",
    "currency": "USD"
  }
  ```

#### Login
- **POST** `/api/login`
- **Request Body:**
  ```json
  {
    "email": "email@example.com",
    "password": "string"
  }
  ```

#### Logout
- **POST** `/api/logout`
- **Headers:** `Authorization: Bearer {token}`

#### Get Current User
- **GET** `/api/me`
- **Headers:** `Authorization: Bearer {token}`

### Profile Management

#### Get Profile
- **GET** `/api/profile`

#### Update Profile
- **PUT** `/api/profile`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "email@example.com",
    "phone": "string",
    "bio": "string",
    "currency": "USD",
    "date_format": "Y-m-d",
    "theme": "light|dark"
  }
  ```

#### Change Password
- **POST** `/api/profile/password`
- **Request Body:**
  ```json
  {
    "current_password": "string",
    "password": "string",
    "password_confirmation": "string"
  }
  ```

#### Upload Profile Picture
- **POST** `/api/profile/picture`
- **Content-Type:** `multipart/form-data`
- **Fields:** `image` (file, max 2MB)

### Transactions

#### List Transactions
- **GET** `/api/transactions?per_page=15&type=expense&category_id=1&from_date=2024-01-01&to_date=2024-12-31&search=query`

#### Create Transaction
- **POST** `/api/transactions`
- **Request Body:**
  ```json
  {
    "category_id": 1,
    "amount": 50.00,
    "type": "expense|income",
    "description": "string",
    "notes": "string",
    "transaction_date": "2024-01-15 14:30:00",
    "payment_method": "cash|card|bank|wallet|other",
    "tags": ["tag1", "tag2"],
    "recurring": false,
    "recurring_frequency": "daily|weekly|monthly|yearly"
  }
  ```

#### Get Transaction
- **GET** `/api/transactions/{id}`

#### Update Transaction
- **PUT** `/api/transactions/{id}`

#### Delete Transaction
- **DELETE** `/api/transactions/{id}`

#### Bulk Delete Transactions
- **POST** `/api/transactions/bulk-delete`
- **Request Body:**
  ```json
  {
    "ids": [1, 2, 3]
  }
  ```

#### Monthly Stats
- **GET** `/api/transactions/monthly-stats`

### Categories

#### List Categories
- **GET** `/api/categories?type=expense&per_page=30`

#### Create Category
- **POST** `/api/categories`
- **Request Body:**
  ```json
  {
    "name": "string",
    "type": "income|expense",
    "description": "string",
    "icon": "emoji",
    "color": "#FF0000"
  }
  ```

#### Get Category
- **GET** `/api/categories/{id}`

#### Update Category
- **PUT** `/api/categories/{id}`

#### Delete Category
- **DELETE** `/api/categories/{id}`

#### Get Default Categories
- **GET** `/api/categories/default?type=expense`

### Budgets

#### List Budgets
- **GET** `/api/budgets?status=active&period=monthly&per_page=15`

#### Create Budget
- **POST** `/api/budgets`
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "amount": 5000.00,
    "period": "daily|weekly|monthly|quarterly|yearly",
    "start_date": "2024-01-01 00:00:00",
    "end_date": "2024-12-31 23:59:59",
    "is_active": true,
    "color": "#3B82F6",
    "categories": [
      {
        "category_id": 1,
        "allocated_amount": 500.00
      }
    ]
  }
  ```

#### Get Budget
- **GET** `/api/budgets/{id}`

#### Update Budget
- **PUT** `/api/budgets/{id}`

#### Delete Budget
- **DELETE** `/api/budgets/{id}`

#### Budget Summary
- **GET** `/api/budgets/summary`

#### Budget Breakdown
- **GET** `/api/budgets/{id}/breakdown`

#### Check Budget Alerts
- **POST** `/api/budgets/check-alerts`

### Financial Goals

#### List Goals
- **GET** `/api/goals?status=active&priority=high&per_page=15`

#### Create Goal
- **POST** `/api/goals`
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "goal_type": "string",
    "target_amount": 10000.00,
    "start_date": "2024-01-01 00:00:00",
    "target_date": "2024-12-31 23:59:59",
    "priority": "low|medium|high",
    "color": "#EF4444",
    "is_active": true
  }
  ```

#### Get Goal
- **GET** `/api/goals/{id}`

#### Update Goal
- **PUT** `/api/goals/{id}`

#### Delete Goal
- **DELETE** `/api/goals/{id}`

#### Record Goal Progress
- **POST** `/api/goals/{id}/progress`
- **Request Body:**
  ```json
  {
    "amount": 100.00,
    "notes": "string"
  }
  ```

#### Get Goal Progress
- **GET** `/api/goals/{id}/progress`

#### Goals Summary
- **GET** `/api/goals/summary`

### Analytics

#### Dashboard Stats
- **GET** `/api/analytics/dashboard`

#### Monthly Trend
- **GET** `/api/analytics/monthly-trend?months=12`

#### Category Breakdown
- **GET** `/api/analytics/category-breakdown?type=expense`

#### Spending Patterns
- **GET** `/api/analytics/spending-patterns`

#### Comparison Stats
- **GET** `/api/analytics/comparison?from_date=2024-01-01&to_date=2024-12-31`

### Reports

#### List Reports
- **GET** `/api/reports?type=summary&per_page=15`

#### Get Report
- **GET** `/api/reports/{id}`

#### Generate Summary Report
- **POST** `/api/reports/generate-summary`

#### Generate Detailed Report
- **POST** `/api/reports/generate-detailed`

#### Generate Comparative Report
- **POST** `/api/reports/generate-comparative?months=12`

#### Generate Forecast Report
- **POST** `/api/reports/generate-forecast?months=12`

#### Export Report
- **POST** `/api/reports/export`
- **Request Body:**
  ```json
  {
    "format": "csv|pdf"
  }
  ```

#### Delete Report
- **DELETE** `/api/reports/{id}`

### Notifications

#### List Notifications
- **GET** `/api/notifications?read=false&type=budget_alert&per_page=20`

#### Get Notification
- **GET** `/api/notifications/{id}`

#### Mark as Read
- **PUT** `/api/notifications/{id}/read`

#### Mark All as Read
- **POST** `/api/notifications/read-all`

#### Unread Count
- **GET** `/api/notifications/unread-count`

#### Delete Notification
- **DELETE** `/api/notifications/{id}`

#### Delete All Notifications
- **DELETE** `/api/notifications`

## Data Models

### User
```php
{
  "id": 1,
  "name": "string",
  "email": "email@example.com",
  "phone": "string",
  "currency": "USD",
  "date_format": "Y-m-d",
  "theme": "light",
  "is_active": true,
  "subscription_type": "free",
  "subscription_until": "2024-12-31T23:59:59Z",
  "total_balance": 5000.00,
  "monthly_expense": 500.00,
  "monthly_income": 3000.00,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Transaction
```php
{
  "id": 1,
  "user_id": 1,
  "category_id": 1,
  "amount": 50.00,
  "type": "expense",
  "description": "Grocery shopping",
  "notes": "string",
  "transaction_date": "2024-01-15T14:30:00Z",
  "payment_method": "card",
  "tags": ["grocery", "food"],
  "recurring": false,
  "recurring_frequency": null,
  "status": "completed",
  "formatted_amount": "-$50.00",
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

### Budget
```php
{
  "id": 1,
  "user_id": 1,
  "name": "Monthly Budget",
  "description": "string",
  "amount": 5000.00,
  "period": "monthly",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "is_active": true,
  "color": "#3B82F6",
  "spent_amount": 1500.00,
  "remaining_amount": 3500.00,
  "percentage_used": 30.00,
  "status": "moderate",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Financial Goal
```php
{
  "id": 1,
  "user_id": 1,
  "name": "Emergency Fund",
  "description": "string",
  "goal_type": "Savings",
  "target_amount": 10000.00,
  "current_amount": 2000.00,
  "start_date": "2024-01-01T00:00:00Z",
  "target_date": "2024-12-31T23:59:59Z",
  "priority": "high",
  "color": "#EF4444",
  "is_active": true,
  "progress_percentage": 20.00,
  "remaining_amount": 8000.00,
  "days_remaining": 350,
  "monthly_savings_needed": 228.57,
  "status": "on_track",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description",
  "errors": {
    "field": ["error message"]
  }
}
```

### HTTP Status Codes

- `200 OK` - Successful GET/PUT/PATCH request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## Pagination

List endpoints support pagination with the following parameters:

- `per_page`: Number of items per page (default: 15)
- `page`: Page number (default: 1)

Response includes:
```json
{
  "data": [...],
  "links": {
    "first": "url",
    "last": "url",
    "prev": "url",
    "next": "url"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "path": "url",
    "per_page": 15,
    "to": 15,
    "total": 75
  }
}
```

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer {token}
```

Tokens are obtained through the `/api/login` or `/api/register` endpoints.

## Best Practices

1. **Always include proper error handling** - Check HTTP status codes and error messages
2. **Use pagination** - Don't retrieve all records at once
3. **Cache frequently accessed data** - Use appropriate cache headers
4. **Validate on client side** - Provide better user experience
5. **Use HTTPS** - Always use HTTPS in production
6. **Rate limiting** - Be aware of rate limits (if implemented)
7. **Keep tokens secure** - Never expose tokens in logs or client-side code

## Support

For issues or questions, please contact support@catadulu.com

## License

This project is licensed under the MIT License.
