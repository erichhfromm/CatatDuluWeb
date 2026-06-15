<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about:catatdulu', function () {
    $this->info('CatatDulu Laravel app is ready.');
})->purpose('Display CatatDulu status');
