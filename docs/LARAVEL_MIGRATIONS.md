# CataDulu - Laravel Database Migrations Guide

## Overview
Complete Laravel migration implementation for CataDulu Personal Finance System database schema.

---

## Migration Files Structure

```
database/migrations/
├── 2024_01_01_000001_create_users_table.php
├── 2024_01_01_000002_create_categories_table.php
├── 2024_01_01_000003_create_transactions_table.php
├── 2024_01_01_000004_create_transaction_attachments_table.php
├── 2024_01_01_000005_create_budgets_table.php
├── 2024_01_01_000006_create_budget_categories_table.php
├── 2024_01_01_000007_create_financial_goals_table.php
├── 2024_01_01_000008_create_goal_progress_table.php
├── 2024_01_01_000009_create_notifications_table.php
├── 2024_01_01_000010_create_budget_alerts_table.php
└── 2024_01_01_000011_create_reports_table.php
```

---

## Migration Implementation Details

### 1. Users Table

```php
<?php
// database/migrations/2024_01_01_000001_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->enum('theme', ['light', 'dark'])->default('light');
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('is_active');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

---

### 2. Categories Table

```php
<?php
// database/migrations/2024_01_01_000002_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('name', 100);
            $table->enum('type', ['income', 'expense']);
            $table->string('icon', 50)->default('folder');
            $table->string('color', 7)->default('#808080');
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'is_active']);
            
            // Foreign Keys
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

---

### 3. Transactions Table

```php
<?php
// database/migrations/2024_01_01_000003_create_transactions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('category_id');
            $table->string('title');
            $table->decimal('amount', 15, 2);
            $table->enum('type', ['income', 'expense']);
            $table->text('description')->nullable();
            $table->date('transaction_date');
            $table->string('receipt_path')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('user_id');
            $table->index('category_id');
            $table->index(['user_id', 'transaction_date']);
            $table->index(['user_id', 'type']);
            $table->index('transaction_date');
            
            // Foreign Keys
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('restrict');
            
            // Check Constraints
            $table->check('amount > 0');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```

---

### 4. Transaction Attachments Table

```php
<?php
// database/migrations/2024_01_01_000004_create_transaction_attachments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transaction_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transaction_id');
            $table->string('file_path');
            $table->string('file_type', 50);
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes
            $table->index('transaction_id');
            
            // Foreign Keys
            $table->foreign('transaction_id')
                ->references('id')
                ->on('transactions')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_attachments');
    }
};
```

---

### 5. Budgets Table

```php
<?php
// database/migrations/2024_01_01_000005_create_budgets_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title');
            $table->decimal('amount', 15, 2);
            $table->decimal('spent', 15, 2)->default(0);
            $table->enum('period', ['monthly', 'yearly']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['active', 'completed', 'exceeded'])->default('active');
            $table->decimal('alert_threshold', 3, 1)->default(80.0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'period']);
            $table->index(['start_date', 'end_date']);
            
            // Foreign Keys
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            
            // Check Constraints
            $table->check('amount > 0');
            $table->check('spent >= 0 AND spent <= amount * 1.5');
            $table->check('end_date IS NULL OR end_date > start_date');
            $table->check('alert_threshold BETWEEN 0 AND 100');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
```

---

### 6. Budget Categories Table

```php
<?php
// database/migrations/2024_01_01_000006_create_budget_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('budget_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('budget_id');
            $table->uuid('category_id');
            $table->decimal('allocated_amount', 15, 2);
            
            // Unique Constraint
            $table->unique(['budget_id', 'category_id']);
            
            // Indexes
            $table->index('budget_id');
            $table->index('category_id');
            
            // Foreign Keys
            $table->foreign('budget_id')
                ->references('id')
                ->on('budgets')
                ->onDelete('cascade');
            
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('restrict');
            
            // Check Constraints
            $table->check('allocated_amount > 0');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_categories');
    }
};
```

---

### 7. Financial Goals Table

```php
<?php
// database/migrations/2024_01_01_000007_create_financial_goals_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('financial_goals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->date('deadline');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
            $table->enum('status', ['active', 'completed', 'abandoned'])->default('active');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'priority']);
            $table->index('deadline');
            
            // Foreign Keys
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            
            // Check Constraints
            $table->check('target_amount > 0');
            $table->check('current_amount >= 0 AND current_amount <= target_amount * 1.5');
            $table->check('deadline > CURDATE()');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_goals');
    }
};
```

---

### 8. Goal Progress Table

```php
<?php
// database/migrations/2024_01_01_000008_create_goal_progress_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('goal_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('goal_id');
            $table->decimal('amount', 15, 2);
            $table->text('notes')->nullable();
            $table->date('recorded_at');
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes
            $table->index('goal_id');
            $table->index('recorded_at');
            $table->index(['goal_id', 'recorded_at']);
            
            // Foreign Keys
            $table->foreign('goal_id')
                ->references('id')
                ->on('financial_goals')
                ->onDelete('cascade');
            
            // Check Constraints
            $table->check('amount > 0');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_progress');
    }
};
```

---

### 9. Notifications Table

```php
<?php
// database/migrations/2024_01_01_000009_create_notifications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('type', ['alert', 'reminder', 'system']);
            $table->string('title');
            $table->text('message');
            $table->enum('related_type', ['budget', 'goal', 'transaction'])->nullable();
            $table->uuid('related_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'created_at']);
            
            // Foreign Keys
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
```

---

### 10. Budget Alerts Table

```php
<?php
// database/migrations/2024_01_01_000010_create_budget_alerts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('budget_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('budget_id');
            $table->enum('alert_type', ['approaching', 'exceeded']);
            $table->timestamp('triggered_at');
            $table->timestamp('acknowledged_at')->nullable();
            
            // Indexes
            $table->index('budget_id');
            $table->index('triggered_at');
            $table->index(['budget_id', 'acknowledged_at']);
            
            // Foreign Keys
            $table->foreign('budget_id')
                ->references('id')
                ->on('budgets')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_alerts');
    }
};
```

---

### 11. Reports Table

```php
<?php
// database/migrations/2024_01_01_000011_create_reports_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('report_type', ['daily', 'weekly', 'monthly', 'yearly']);
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('total_income', 15, 2)->default(0);
            $table->decimal('total_expense', 15, 2)->default(0);
            $table->timestamp('generated_at');
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'report_type']);
            $table->index(['period_start', 'period_end']);
            $table->index('generated_at');
            
            // Foreign Keys
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            
            // Check Constraints
            $table->check('period_end >= period_start');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
```

---

## Running Migrations

```bash
# Run all pending migrations
php artisan migrate

# Run migrations with seeding
php artisan migrate --seed

# Rollback latest batch of migrations
php artisan migrate:rollback

# Rollback all migrations
php artisan migrate:reset

# Rollback and re-run all migrations
php artisan migrate:refresh

# Show migration status
php artisan migrate:status
```

---

## Seeding (Optional)

Create seeders to populate initial data:

```bash
php artisan make:seeder UsersSeeder
php artisan make:seeder CategoriesSeeder
```

### Example Users Seeder

```php
<?php
// database/seeders/UsersSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'id' => Str::uuid(),
                'name' => 'Demo User',
                'email' => 'demo@catadulu.com',
                'password' => bcrypt('password123'),
                'currency' => 'USD',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
```

---

## Eloquent Model Setup

After migrations, create corresponding models:

```php
// app/Models/User.php
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;
    
    public function categories(): HasMany { return $this->hasMany(Category::class); }
    public function transactions(): HasMany { return $this->hasMany(Transaction::class); }
    public function budgets(): HasMany { return $this->hasMany(Budget::class); }
    public function goals(): HasMany { return $this->hasMany(FinancialGoal::class); }
    public function notifications(): HasMany { return $this->hasMany(Notification::class); }
    public function reports(): HasMany { return $this->hasMany(Report::class); }
}

// app/Models/Category.php
class Category extends Model
{
    protected $table = 'categories';
    protected $keyType = 'string';
    public $incrementing = false;
    
    public function user() { return $this->belongsTo(User::class); }
    public function transactions() { return $this->hasMany(Transaction::class); }
}

// ... (similar structure for other models)
```

---

## Best Practices

1. **Always run migrations in order** - Dependencies are explicit
2. **Use UUIDs for multi-tenant systems** - Better for distributed systems
3. **Soft deletes** - Consider adding soft deletes for audit trails
4. **Timestamps** - Always include created_at and updated_at
5. **Foreign keys** - Always define foreign key relationships
6. **Indexes** - Create indexes on frequently queried columns
7. **Check constraints** - Enforce data integrity at DB level
8. **Testing** - Test migrations with DatabaseTransactions trait

---

## Troubleshooting

**Error: SQLSTATE[HY000]: General error**
- Check foreign key constraints are in correct order
- Ensure UUIDs are generated properly

**Error: Column does not exist**
- Verify migration ran successfully
- Run `php artisan migrate:status` to check

**Error: Table already exists**
- Migration already ran; skip or rollback if needed

---

## Summary

✅ 11 complete migration files
✅ All foreign key constraints defined
✅ Comprehensive indexing strategy
✅ Data integrity constraints
✅ Proper cascade delete policies
✅ Ready for Laravel Eloquent ORM integration
