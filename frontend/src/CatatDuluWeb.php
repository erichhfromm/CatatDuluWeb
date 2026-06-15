<?php

declare(strict_types=1);

final class CatatDuluWeb
{
    public const FRAMEWORK = 'Laravel';
    public const SERVER_TARGET = 'Laragon';
    public const APPLICATION_ROOT = __DIR__.'/../backend';
    public const PUBLIC_ROOT = self::APPLICATION_ROOT.'/public';

    public static function screens(): array
    {
        return [
            'splash',
            'login',
            'register',
            'input-otp', // ◄ TAMBAHKAN INI agar rute halaman OTP valid dan dikenali sistem
            'dashboard',
            'income',
            'expense',
            'transaction-detail',
            'budget',
            'analytics',
            'reports',
            'notifications',
            'profile',
            'settings',
            'design-system',
            'empty',
            'error',
        ];
    }
}