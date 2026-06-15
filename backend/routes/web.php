<?php

use Illuminate\Support\Facades\Route;

// We are migrating to a decoupled React frontend. 
// The React built output (index.html) is copied to resources/views/react.blade.php
// We define a catch-all route to serve the React app for all non-API paths.

Route::get('/{any?}', function () {
    return view('react');
})->where('any', '.*');
