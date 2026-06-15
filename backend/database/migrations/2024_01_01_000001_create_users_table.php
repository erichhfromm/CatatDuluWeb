<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('currency')->default('USD');
            $table->string('date_format')->default('Y-m-d');
            $table->string('theme')->default('light');
            $table->boolean('is_active')->default(true);
            $table->string('subscription_type')->default('free');
            $table->timestamp('subscription_until')->nullable();
            $table->string('profile_picture')->nullable();
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index('email');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
