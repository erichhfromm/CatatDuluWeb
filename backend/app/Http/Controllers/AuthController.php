<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

    /**
     * Kirim OTP via WhatsApp menggunakan Fonnte.
     * Return true jika berhasil / bypass lokal, false jika gagal.
     */
    private function sendWhatsappOTP(string $phoneNumber, string $otpCode): bool
    {
        try {
            $token = env('FONNTE_TOKEN', '');

            // Bypass otomatis jika token belum dikonfigurasi (mode lokal)
            if (empty($token) || $token === 'TOKEN_FONNTE_KAMU_DISINI') {
                Log::info("[OTP-WA BYPASS] Target: $phoneNumber | Kode: $otpCode");
                return true;
            }

            $response = Http::timeout(10)->withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target'      => $phoneNumber,
                'message'     => "[CatatDulu] Kode OTP Anda adalah: *$otpCode*\n\nDemi keamanan, jangan sebarkan kode ini kepada siapapun. Kode berlaku selama 15 menit.",
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                Log::info("[OTP-WA SUCCESS] Terkirim ke: $phoneNumber");
                return true;
            }

            Log::warning("[OTP-WA FAILED] Respons Fonnte: " . $response->body());
            return false;

        } catch (\Exception $e) {
            Log::error('[OTP-WA ERROR] ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Kirim OTP via Email menggunakan Laravel Mail atau Mailtrap API.
     * Return true jika berhasil, false jika gagal.
     */
    private function sendEmailOTP(string $email, string $otpCode, string $userName, string $purpose = 'register'): bool
    {
        try {
            $apiKey = env('MAILTRAP_API_KEY');

            if (empty($apiKey)) {
                // Fallback ke Laravel Mailer bawaan (.env SMTP/Log) jika API Key tidak diisi
                Mail::to($email)->send(new OtpMail($otpCode, $userName, $purpose));
                Log::info("[OTP-EMAIL SUCCESS] Terkirim ke: $email (Standard Mailer)");
                return true;
            }

            $subject = $purpose === 'reset-password'
                ? '[CatatDulu] Kode OTP Reset Password'
                : '[CatatDulu] Kode OTP Verifikasi Akun';

            // Render blade template ke bentuk HTML string
            $htmlContent = view('emails.otp', [
                'otpCode' => $otpCode,
                'userName'  => $userName,
                'purpose'   => $purpose
            ])->render();

            $response = Http::withToken($apiKey)
                ->timeout(10)
                ->post('https://send.api.mailtrap.io/api/send', [
                    'from' => [
                        'email' => env('MAIL_FROM_ADDRESS', 'hello@demomailtrap.co'),
                        'name'  => env('MAIL_FROM_NAME', 'CatatDulu')
                    ],
                    'to' => [
                        ['email' => $email]
                    ],
                    'subject' => $subject,
                    'html'    => $htmlContent,
                    'category'=> 'OTP Verification'
                ]);

            if ($response->successful()) {
                Log::info("[OTP-EMAIL SUCCESS] Terkirim via Mailtrap API ke: $email");
                return true;
            }

            Log::error('[OTP-EMAIL API FAILED] Response: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error('[OTP-EMAIL ERROR] ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Kirim OTP ke semua channel yang dikonfigurasi (Email + WhatsApp).
     * Selalu return true agar proses register tidak crash jika salah satu channel gagal.
     */
    private function sendOTP(string $email, string $phone, string $otpCode, string $userName, string $purpose = 'register'): void
    {
        // Channel 1: Email (selalu dicoba)
        $emailSent = $this->sendEmailOTP($email, $otpCode, $userName, $purpose);

        // Channel 2: WhatsApp via Fonnte (selalu dicoba)
        $waSent = $this->sendWhatsappOTP($phone, $otpCode);

        Log::info("[OTP DISPATCH] Email: " . ($emailSent ? 'OK' : 'FAIL') . " | WA: " . ($waSent ? 'OK' : 'FAIL') . " | Target: $email / $phone");
    }

    // ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────────

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'min:3', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'phone'    => ['required', 'string', 'min:10', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'],
            'currency' => ['nullable', 'string', 'size:3'],
        ]);

        // 1. Generate 6 digit OTP
        $otpCode = (string) rand(100000, 999999);

        // 2. Simpan user dengan status belum aktif
        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'phone'     => $validated['phone'],
            'password'  => $validated['password'],
            'currency'  => $validated['currency'] ?? 'IDR',
            'is_active' => false,
            'otp_code'  => $otpCode,
        ]);

        // 3. Kirim OTP ke Email + WhatsApp secara bersamaan
        $this->sendOTP($user->email, $user->phone, $otpCode, $user->name, 'register');

        // 4. Susun response
        $response = [
            'message' => 'Pendaftaran berhasil! Kode OTP telah dikirim ke email dan WhatsApp Anda.',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'otp_channels' => ['email', 'whatsapp'],
        ];

        // Tampilkan OTP di response hanya saat development lokal
        if (env('APP_ENV') === 'local') {
            $response['dev_otp'] = $otpCode;
        }

        return response()->json($response, 201);
    }

    /**
     * Endpoint verifikasi OTP dari halaman frontend
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'otp'   => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || $user->otp_code !== $validated['otp']) {
            return response()->json([
                'message' => 'Kode OTP salah atau telah kedaluwarsa.',
            ], 400);
        }

        // Aktifkan akun & hapus OTP dari database
        $user->update([
            'is_active' => true,
            'otp_code'  => null,
        ]);

        // Buat kategori default jika user belum punya kategori
        if ($user->categories()->count() === 0) {
            $this->createDefaultCategories($user);
        }

        Log::info("[OTP VERIFIED] Akun diaktifkan: {$user->email}");

        return response()->json([
            'message' => 'Akun berhasil diverifikasi! Silakan masuk menggunakan email dan password Anda.',
        ], 200);
    }

    /**
     * Endpoint untuk kirim ulang OTP
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user->is_active) {
            return response()->json(['message' => 'Akun ini sudah aktif.'], 400);
        }

        // Generate OTP baru
        $otpCode = (string) rand(100000, 999999);
        $user->update(['otp_code' => $otpCode]);

        // Kirim ke semua channel
        $this->sendOTP($user->email, $user->phone, $otpCode, $user->name, 'register');

        $response = ['message' => 'Kode OTP baru telah dikirim ke email dan WhatsApp Anda.'];

        if (env('APP_ENV') === 'local') {
            $response['dev_otp'] = $otpCode;
        }

        return response()->json($response);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        // Mendukung field 'login' (mobile: email atau nomor HP) ATAU 'email' (React web)
        $loginInput = $request->input('login') ?? $request->input('email');

        if (empty($loginInput)) {
            return response()->json(['message' => 'Email atau nomor HP diperlukan.'], 422);
        }

        // Tentukan apakah input adalah email atau nomor HP
        $field = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $user = \App\Models\User::where($field, $loginInput)->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Email/nomor HP atau password salah.',
            ], 401);
        }

        // Cek apakah user sudah verifikasi OTP
        if (!$user->is_active) {
            return response()->json([
                'message'      => 'Akun Anda belum aktif. Silakan lakukan verifikasi OTP terlebih dahulu.',
                'requires_otp' => true,
                'email'        => $user->email,
                'phone'        => $user->phone,
            ], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil! Selamat datang kembali.',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'token'   => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil keluar.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function passwordReset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user    = User::where('email', $validated['email'])->first();
        $otpCode = (string) rand(100000, 999999);

        // Simpan OTP di kolom otp_code yang sama
        $user->update(['otp_code' => $otpCode]);

        // Kirim OTP ke semua channel
        $this->sendOTP($user->email, $user->phone, $otpCode, $user->name, 'reset-password');

        $response = [
            'message' => 'Kode OTP reset password telah dikirim ke email dan WhatsApp Anda.',
        ];

        if (env('APP_ENV') === 'local') {
            $response['dev_otp'] = $otpCode;
        }

        return response()->json($response);
    }

    public function passwordResetConfirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => ['required', 'email', 'exists:users,email'],
            'otp'      => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || $user->otp_code !== $validated['otp']) {
            return response()->json(['message' => 'Kode OTP salah atau telah kedaluwarsa.'], 400);
        }

        $user->update([
            'password' => Hash::make($validated['password']), // ✅ Selalu hash password sebelum disimpan
            'otp_code' => null,
        ]);

        Log::info("[PASSWORD RESET] Password diperbarui untuk: {$user->email}");

        return response()->json(['message' => 'Password berhasil diperbarui! Silakan masuk dengan password baru Anda.']);
    }

    private function createDefaultCategories(User $user): void
    {
        $incomeCategories = [
            ['name' => 'Salary', 'icon' => '💰', 'color' => '#10B981'],
            ['name' => 'Freelance', 'icon' => '💻', 'color' => '#3B82F6'],
            ['name' => 'Investment', 'icon' => '📈', 'color' => '#8B5CF6'],
            ['name' => 'Bonus', 'icon' => '🎁', 'color' => '#F59E0B'],
        ];

        $expenseCategories = [
            ['name' => 'Food & Dining', 'icon' => '🍔', 'color' => '#EF4444'],
            ['name' => 'Transportation', 'icon' => '🚗', 'color' => '#F97316'],
            ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#EC4899'],
            ['name' => 'Utilities', 'icon' => '💡', 'color' => '#06B6D4'],
            ['name' => 'Healthcare', 'icon' => '⚕️', 'color' => '#D946EF'],
            ['name' => 'Shopping', 'icon' => '🛍️', 'color' => '#8B5CF6'],
            ['name' => 'Education', 'icon' => '📚', 'color' => '#3B82F6'],
            ['name' => 'Rent', 'icon' => '🏠', 'color' => '#10B981'],
        ];

        foreach ($incomeCategories as $cat) {
            $user->categories()->create(array_merge($cat, [
                'type' => 'income',
                'slug' => \Str::slug($cat['name']),
                'is_custom' => false,
            ]));
        }

        foreach ($expenseCategories as $cat) {
            $user->categories()->create(array_merge($cat, [
                'type' => 'expense',
                'slug' => \Str::slug($cat['name']),
                'is_custom' => false,
            ]));
        }
    }
}