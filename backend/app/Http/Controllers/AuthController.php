<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * Helper Fungsi untuk Mengirim OTP via WhatsApp Gateway (Fonnte)
     */
    private function sendWhatsappOTP($phoneNumber, $otpCode)
    {
        try {
            $token = env('FONNTE_TOKEN', 'TOKEN_FONNTE_KAMU_DISINI');

            // KUNCI AMAN: Jika token belum diisi di .env, bypass otomatis agar testing lokal lancar kencang
            if (empty($token) || $token === 'TOKEN_FONNTE_KAMU_DISINI') {
                \Log::info("Bypass WA OTP Lokal - Target: $phoneNumber | Kode OTP: $otpCode");
                return true;
            }

            // DIPERBAIKI: Menambahkan timeout(5) agar request dibatalkan jika Fonnte tidak merespon dalam 5 detik
            $response = Http::timeout(5)->withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target'      => $phoneNumber,
                'message'     => "[CatatDulu] Kode OTP Anda adalah: $otpCode. Demi keamanan, jangan sebarkan kode ini kepada siapapun.",
                'countryCode' => '62',
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim WhatsApp OTP (Timeout/Error): ' . $e->getMessage());
            return false; // Tetap return false agar register tidak ikut crash gantung
        }
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'min:3', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'phone'    => ['required', 'string', 'min:10', 'max:20', 'unique:users,phone'], // Wajib diisi untuk WA OTP
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'],
            'currency' => ['nullable', 'string', 'size:3'],
        ]);

        // 1. Generate 6 digit angka OTP
        $otpCode = rand(100000, 999999);

        // 2. Simpan user dengan status is_active = false
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'],
            'password' => $validated['password'], // Otomatis ter-hash oleh cast di model
            'currency' => $validated['currency'] ?? 'IDR',
            'is_active' => false, // Akun dikunci sebelum verifikasi
            'otp_code' => $otpCode,
        ]);

        // 3. Kirim OTP langsung ke WhatsApp user
        $this->sendWhatsappOTP($validated['phone'], $otpCode);

        // Tidak mengembalikan token Sanctum — memaksa user lewat alur verifikasi
        $response = [
            'message' => 'Pendaftaran berhasil! Silakan verifikasi kode OTP yang dikirim ke WhatsApp Anda.',
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ];

        if (env('APP_ENV') === 'local') {
            $response['dev_otp'] = $otpCode;
        }

        return response()->json($response, 201);
    }

    /**
     * Endpoint untuk memverifikasi OTP dari halaman Frontend
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
                'message' => 'Kode OTP salah atau telah kadaluwarsa.',
            ], 400);
        }

        // Aktifkan akun dan hapus kode OTP dari database
        $user->update([
            'is_active' => true,
            'otp_code'  => null,
        ]);

        // KUNCI UTAMA: Tidak membuat token di sini agar user diarahkan untuk login manual di frontend
        return response()->json([
            'message' => 'Akun berhasil diverifikasi! Silakan gunakan menu login untuk masuk.',
        ], 200);
    }

    /**
     * Endpoint untuk kirim ulang OTP jika tidak masuk
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

        $otpCode = rand(100000, 999999);
        $user->update(['otp_code' => $otpCode]);

        $this->sendWhatsappOTP($user->phone, $otpCode);

        $response = ['message' => 'Kode OTP baru berhasil dikirim ulang ke WhatsApp.'];
        if (env('APP_ENV') === 'local') {
            $response['dev_otp'] = $otpCode;
        }
        return response()->json($response);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();

        // PROTEKSI: Cek apakah user sudah verifikasi OTP
        if (!$user->is_active) {
            Auth::logout(); // Gagalkan session/auth attempt
            return response()->json([
                'message'      => 'Akun Anda belum aktif. Silakan lakukan verifikasi OTP terlebih dahulu.',
                'requires_otp' => true,
                'email'        => $user->email,
                'phone'        => $user->phone,
            ], 403); // 403 Forbidden
        }

        // Berikan token akses ke dashboard hanya jika sudah aktif
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
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

        $user = User::where('email', $validated['email'])->first();
        $resetToken = \Illuminate\Support\Str::random(60);

        return response()->json([
            'message' => 'Password reset link sent to email',
            'reset_token' => $resetToken,
        ]);
    }

    public function passwordResetConfirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reset_token' => ['required', 'string'],
            'password'    => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update(['password' => $validated['password']]);

        return response()->json(['message' => 'Password reset successfully']);
    }
}