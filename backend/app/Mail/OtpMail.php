<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $otpCode;
    public string $userName;
    public string $purpose; // 'register' atau 'reset-password'

    public function __construct(string $otpCode, string $userName, string $purpose = 'register')
    {
        $this->otpCode   = $otpCode;
        $this->userName  = $userName;
        $this->purpose   = $purpose;
    }

    public function envelope(): Envelope
    {
        $subject = $this->purpose === 'reset-password'
            ? '[CatatDulu] Kode OTP Reset Password'
            : '[CatatDulu] Kode OTP Verifikasi Akun';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.otp');
    }

    public function attachments(): array
    {
        return [];
    }
}
