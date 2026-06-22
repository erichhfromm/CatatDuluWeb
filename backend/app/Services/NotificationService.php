<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Buat notifikasi baru untuk user tertentu.
     */
    public static function create(User $user, string $title, string $message, string $type = 'info', ?int $relatedId = null, ?string $relatedType = null): Notification
    {
        return Notification::create([
            'user_id'      => $user->id,
            'title'        => $title,
            'message'      => $message,
            'type'         => $type,
            'related_id'   => $relatedId,
            'related_type' => $relatedType,
        ]);
    }

    // ─── Transaksi ────────────────────────────────────────────

    public static function transactionCreated(User $user, string $category, float $amount, string $transactionType, int $transactionId): void
    {
        $amountFormatted = 'Rp ' . number_format($amount, 0, ',', '.');
        $label           = $transactionType === 'income' ? 'Pemasukan' : 'Pengeluaran';
        $icon            = $transactionType === 'income' ? '💰' : '💸';

        self::create(
            $user,
            "{$icon} {$label} Baru Dicatat",
            "{$label} sebesar {$amountFormatted} untuk kategori \"{$category}\" berhasil disimpan.",
            $transactionType === 'income' ? 'income' : 'expense',
            $transactionId,
            'Transaction'
        );
    }

    public static function transactionDeleted(User $user, string $category, float $amount, string $transactionType): void
    {
        $amountFormatted = 'Rp ' . number_format($amount, 0, ',', '.');
        $label           = $transactionType === 'income' ? 'Pemasukan' : 'Pengeluaran';

        self::create(
            $user,
            "🗑️ {$label} Dihapus",
            "{$label} sebesar {$amountFormatted} untuk kategori \"{$category}\" telah dihapus.",
            'info'
        );
    }

    // ─── Budget ───────────────────────────────────────────────

    public static function budgetCreated(User $user, string $budgetName, float $amount, int $budgetId): void
    {
        $amountFormatted = 'Rp ' . number_format($amount, 0, ',', '.');

        self::create(
            $user,
            "📊 Budget Baru Dibuat",
            "Budget \"{$budgetName}\" dengan alokasi {$amountFormatted} berhasil dibuat.",
            'info',
            $budgetId,
            'Budget'
        );
    }

    public static function budgetDeleted(User $user, string $budgetName): void
    {
        self::create(
            $user,
            "🗑️ Budget Dihapus",
            "Budget \"{$budgetName}\" telah dihapus dari daftar anggaran Anda.",
            'info'
        );
    }

    public static function budgetAlert(User $user, string $budgetName, float $percentage, int $budgetId): void
    {
        $pct  = round($percentage);
        $type = $percentage >= 100 ? 'danger' : 'warning';
        $msg  = $percentage >= 100
            ? "⚠️ Budget \"{$budgetName}\" sudah HABIS (100%)! Pengeluaran Anda telah melebihi batas anggaran."
            : "⚡ Budget \"{$budgetName}\" sudah mencapai {$pct}% dari batas. Segera tinjau pengeluaran Anda.";

        self::create(
            $user,
            $percentage >= 100 ? '🚨 Anggaran Habis' : '⚠️ Peringatan Anggaran',
            $msg,
            'budget_alert',
            $budgetId,
            'Budget'
        );
    }

    // ─── Goal / Target Tabungan ───────────────────────────────

    public static function goalCreated(User $user, string $goalName, float $target, int $goalId): void
    {
        $targetFormatted = 'Rp ' . number_format($target, 0, ',', '.');

        self::create(
            $user,
            "🎯 Target Baru Ditambahkan",
            "Target \"{$goalName}\" dengan nilai {$targetFormatted} berhasil dibuat. Semangat menabung!",
            'info',
            $goalId,
            'FinancialGoal'
        );
    }

    public static function goalProgressRecorded(User $user, string $goalName, float $amount, float $percentage, int $goalId): void
    {
        $amountFormatted = 'Rp ' . number_format($amount, 0, ',', '.');
        $pct             = round($percentage);

        if ($percentage >= 100) {
            self::create(
                $user,
                "🎉 Target Tercapai!",
                "Selamat! Target \"{$goalName}\" sudah tercapai 100%. Luar biasa!",
                'success',
                $goalId,
                'FinancialGoal'
            );
        } else {
            self::create(
                $user,
                "💪 Progress Target Diperbarui",
                "Tabungan {$amountFormatted} ditambahkan ke target \"{$goalName}\". Progress: {$pct}%.",
                'info',
                $goalId,
                'FinancialGoal'
            );
        }
    }

    public static function goalDeleted(User $user, string $goalName): void
    {
        self::create(
            $user,
            "🗑️ Target Dihapus",
            "Target \"{$goalName}\" telah dihapus dari daftar tabungan Anda.",
            'info'
        );
    }
}
