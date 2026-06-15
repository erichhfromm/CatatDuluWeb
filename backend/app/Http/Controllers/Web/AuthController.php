<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http; // Tambahkan ini untuk hit API WA
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Fungsi Helper untuk Mengirim OTP via WhatsApp (Fonnte)
     */
    private function sendWhatsappOTP($phoneNumber, $otpCode)
    {
        try {
            // Ambil token dari file .env agar aman, atau ganti langsung string token di sini jika untuk testing
            $token = env('FONNTE_TOKEN', 'TOKEN_FONNTE_KAMU_DISINI'); 

            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target'      => $phoneNumber,
                'message'     => "[CatatDulu] Kode OTP Anda adalah: $otpCode. Demi keamanan, jangan sebarkan kode ini kepada siapapun.",
                'countryCode' => '62', // Otomatis mengarah ke kode negara Indonesia jika nomor diawali 08
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim WhatsApp OTP: ' . $e->getMessage());
            return false;
        }
    }

    public function register(Request $request)
    {
        // 1. Tambahkan validasi nomor telepon (phone_number)
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone_number' => ['required', 'string', 'min:10', 'unique:users,phone_number'], // Pastikan ada kolom phone_number di tabel users kamu
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // 2. Generate 6 digit OTP berkala
        $otpCode = rand(100000, 999999);

        // 3. Simpan data user ke database (is_active di-set false karena belum verifikasi OTP)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'currency' => 'IDR',
            'is_active' => false, // User belum aktif sebelum OTP diverifikasi
            'otp_code' => $otpCode, // Pastikan kamu sudah buat kolom 'otp_code' di migration tabel users
        ]);

        // 4. Kirim OTP ke WhatsApp user
        $this->sendWhatsappOTP($request->phone_number, $otpCode);

        // 5. Simpan email/ID user di session untuk proses verifikasi nanti
        $request->session()->put('otp_email', $user->email);

        // 6. Alihkan user ke halaman pengisian OTP (sesuaikan nama route halaman OTP milikmu)
        return redirect()->route('catatdulu.screen', ['screen' => 'input-otp']);
    }

    /**
     * Fungsi Baru: Untuk memproses verifikasi OTP yang dimasukkan user
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        // Ambil email dari session saat register tadi
        $email = $request->session()->get('otp_email');
        if (!$email) {
            return redirect()->route('catatdulu.home')->withErrors(['error' => 'Sesi habis, silakan register kembali.']);
        }

        $user = User::where('email', $email)->first();

        // Cek apakah OTP cocok
        if ($user && $user->otp_code === $request->otp) {
            // Kosongkan OTP kembali dan aktifkan user
            $user->update([
                'otp_code' => null,
                'is_active' => true,
            ]);

            // Login-kan user otomatis
            Auth::login($user);
            $request->session()->forget('otp_email'); // Bersihkan session OTP

            return redirect()->route('catatdulu.screen', ['screen' => 'dashboard']);
        }

        // Jika OTP salah
        return back()->withErrors(['otp' => 'Kode OTP yang Anda masukkan salah atau kadaluwarsa.']);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            // Cek jika user belum aktif (belum verifikasi OTP)
            if (!Auth::user()->is_active) {
                // Kamu bisa generate ulang OTP disini jika mau, atau langsung tendang ke halaman OTP
                $request->session()->put('otp_email', Auth::user()->email);
                Auth::logout();
                return redirect()->route('catatdulu.screen', ['screen' => 'input-otp'])->withErrors(['otp' => 'Akun Anda belum aktif, silakan verifikasi OTP terlebih dahulu.']);
            }

            $request->session()->regenerate();
            return redirect()->route('catatdulu.screen', ['screen' => 'dashboard']);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('catatdulu.home');
    }
}