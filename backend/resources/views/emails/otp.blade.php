<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Kode OTP CatatDulu</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; background: #f1f5f9; color: #0f172a; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 40px 40px 32px; text-align: center; }
    .header .logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .header .logo-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.75); font-size: 13px; margin-top: 4px; }
    .body { padding: 40px; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
    .body p { font-size: 14px; line-height: 1.7; color: #475569; }
    .otp-box { margin: 28px 0; background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 2px dashed #3B82F6; border-radius: 16px; padding: 24px; text-align: center; }
    .otp-label { font-size: 12px; font-weight: 600; color: #3B82F6; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
    .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #1E3A8A; font-family: 'Courier New', monospace; }
    .otp-expiry { font-size: 12px; color: #64748b; margin-top: 8px; }
    .warning-box { background: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 14px 16px; margin-top: 24px; font-size: 13px; color: #9A3412; line-height: 1.6; }
    .warning-box strong { display: block; margin-bottom: 4px; }
    .purpose-badge { display: inline-block; background: {{ $purpose === 'register' ? '#ECFDF5' : '#FEF3C7' }}; color: {{ $purpose === 'register' ? '#065F46' : '#92400E' }}; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 50px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .footer { background: #F8FAFC; padding: 24px 40px; border-top: 1px solid #E2E8F0; text-align: center; }
    .footer p { font-size: 12px; color: #94a3b8; line-height: 1.8; }
    .footer a { color: #3B82F6; text-decoration: none; }
    @media (max-width: 600px) {
      .body { padding: 24px; }
      .header { padding: 28px 24px; }
      .otp-code { font-size: 32px; letter-spacing: 8px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">💰</div>
      </div>
      <h1>CatatDulu</h1>
      <p>Personal Finance Management</p>
    </div>

    <div class="body">
      <div class="purpose-badge">
        {{ $purpose === 'register' ? '✅ Verifikasi Akun Baru' : '🔐 Reset Password' }}
      </div>

      <p class="greeting">Halo, {{ $userName }}! 👋</p>

      <p>
        @if($purpose === 'register')
          Terima kasih telah mendaftar di <strong>CatatDulu</strong>! Untuk mengaktifkan akun Anda, masukkan kode OTP berikut di halaman verifikasi.
        @else
          Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode OTP berikut untuk melanjutkan proses reset password.
        @endif
      </p>

      <div class="otp-box">
        <div class="otp-label">🔐 Kode OTP Anda</div>
        <div class="otp-code">{{ $otpCode }}</div>
        <div class="otp-expiry">⏱️ Berlaku selama <strong>15 menit</strong></div>
      </div>

      <p>Masukkan kode ini di aplikasi CatatDulu untuk melanjutkan. Jangan pernah membagikan kode ini kepada siapapun.</p>

      <div class="warning-box">
        <strong>⚠️ Peringatan Keamanan</strong>
        Tim CatatDulu <strong>tidak pernah</strong> meminta kode OTP Anda melalui telepon, chat, atau media apapun. Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dan segera hubungi kami.
      </div>
    </div>

    <div class="footer">
      <p>
        Email ini dikirim secara otomatis. Mohon jangan membalas email ini.<br />
        © {{ date('Y') }} <strong>CatatDulu</strong> · Platform Keuangan Personal Terpercaya<br />
        <a href="#">Kebijakan Privasi</a> &bull; <a href="#">Bantuan</a>
      </p>
    </div>
  </div>
</body>
</html>
