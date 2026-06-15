<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_alerts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('budget_id');
            $table->enum('alert_type', ['warning', 'critical']);
            $table->unsignedInteger('threshold_percentage');
            $table->boolean('is_triggered')->default(false);
            $table->timestamp('triggered_at')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
            
            $table->foreign('budget_id')->references('id')->on('budgets')->onDelete('cascade');
            $table->index(['budget_id', 'is_triggered']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_alerts');
    }
};
