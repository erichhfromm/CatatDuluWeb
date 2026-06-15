<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

// Public Routes (Bisa diakses tanpa token/login)
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/password-reset', [AuthController::class, 'passwordReset'])->name('password.reset');
Route::post('/password-reset-confirm', [AuthController::class, 'passwordResetConfirm'])->name('password.confirm');

// WhatsApp OTP Routes (Wajib di luar middleware auth karena user belum memegang Token)
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('otp.verify');
Route::post('/resend-otp', [AuthController::class, 'resendOtp'])->name('otp.resend');


// Protected Routes (Wajib menyertakan Bearer Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AuthController::class, 'me'])->name('me');

    Route::prefix('profile')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'show')->name('profile.show');
        Route::put('/', 'update')->name('profile.update');
        Route::post('/password', 'changePassword')->name('profile.password');
        Route::post('/picture', 'uploadProfilePicture')->name('profile.picture');
        Route::get('/preferences', 'preferences')->name('profile.preferences');
        Route::put('/preferences', 'updatePreferences')->name('profile.preferences.update');
    });

    Route::prefix('dashboard')->controller(DashboardController::class)->group(function () {
        Route::get('/stats', 'stats')->name('dashboard.stats');
        Route::get('/recent-transactions', 'recentTransactions')->name('dashboard.recent');
    });

    Route::apiResource('transactions', TransactionController::class);
    Route::post('/transactions/bulk-delete', [TransactionController::class, 'bulkDelete'])->name('transactions.bulk-delete');
    Route::get('/transactions/monthly-stats', [TransactionController::class, 'monthlyStats'])->name('transactions.stats');

    Route::apiResource('categories', CategoryController::class);
    Route::get('/categories/default', [CategoryController::class, 'default'])->name('categories.default');

    Route::apiResource('budgets', BudgetController::class);
    Route::get('/budgets/summary', [BudgetController::class, 'summary'])->name('budgets.summary');
    Route::post('/budgets/check-alerts', [BudgetController::class, 'checkAlerts'])->name('budgets.alerts');
    Route::get('/budgets/{budget}/breakdown', [BudgetController::class, 'breakdown'])->name('budgets.breakdown');

    Route::apiResource('goals', GoalController::class);
    Route::post('/goals/{goal}/progress', [GoalController::class, 'recordProgress'])->name('goals.progress');
    Route::get('/goals/summary', [GoalController::class, 'summary'])->name('goals.summary');
    Route::get('/goals/{goal}/progress', [GoalController::class, 'progress'])->name('goals.progress.show');

    Route::prefix('analytics')->controller(AnalyticsController::class)->group(function () {
        Route::get('/dashboard', 'dashboard')->name('analytics.dashboard');
        Route::get('/monthly-trend', 'monthlyTrend')->name('analytics.trend');
        Route::get('/category-breakdown', 'categoryBreakdown')->name('analytics.category');
        Route::get('/spending-patterns', 'spendingPatterns')->name('analytics.patterns');
        Route::get('/comparison', 'comparison')->name('analytics.comparison');
    });

    Route::prefix('reports')->controller(ReportController::class)->group(function () {
        Route::get('/', 'index')->name('reports.index');
        Route::get('/{report}', 'show')->name('reports.show');
        Route::post('/generate-summary', 'generateSummary')->name('reports.summary');
        Route::post('/generate-detailed', 'generateDetailed')->name('reports.detailed');
        Route::post('/generate-comparative', 'generateComparative')->name('reports.comparative');
        Route::post('/generate-forecast', 'generateForecast')->name('reports.forecast');
        Route::post('/export', 'export')->name('reports.export');
        Route::delete('/{report}', 'delete')->name('reports.delete');
    });

    Route::prefix('notifications')->controller(NotificationController::class)->group(function () {
        Route::get('/', 'index')->name('notifications.index');
        Route::get('/{notification}', 'show')->name('notifications.show');
        Route::put('/{notification}/read', 'markAsRead')->name('notifications.read');
        Route::post('/read-all', 'markAllAsRead')->name('notifications.read-all');
        Route::get('/unread-count', 'unreadCount')->name('notifications.unread');
        Route::delete('/{notification}', 'delete')->name('notifications.delete');
        Route::delete('/', 'deleteAll')->name('notifications.delete-all');
    });
});