<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| CataDuluWeb PHP Migration Note
|--------------------------------------------------------------------------
|
| Folder src sekarang hanya berisi PHP. Implementasi aplikasi utama sudah
| dipindahkan ke backend/ sebagai aplikasi Laravel untuk Laragon.
|
| Entry point web:
| - backend/public/index.php
|
| Blade UI:
| - backend/resources/views/catatdulu/app.blade.php
| - backend/resources/views/catatdulu/partials/*.blade.php
|
| Data demo pengganti src/app/catatdulu/data.ts:
| - backend/app/Support/CatatDuluData.php
|
*/
