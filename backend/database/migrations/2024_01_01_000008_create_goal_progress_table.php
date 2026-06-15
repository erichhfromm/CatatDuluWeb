<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goal_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('financial_goal_id');
            $table->decimal('amount', 15, 2);
            $table->text('notes')->nullable();
            $table->dateTime('recorded_date');
            $table->timestamps();
            
            $table->foreign('financial_goal_id')->references('id')->on('financial_goals')->onDelete('cascade');
            $table->index(['financial_goal_id', 'recorded_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_progress');
    }
};
