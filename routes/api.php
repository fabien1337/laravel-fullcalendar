<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GoogleCalendarController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::apiResources(['events' => EventController::class]);

Route::prefix('google-calendar')->group(function () {
    Route::put('update/{event_id}', [GoogleCalendarController::class, 'update'])->name('google_calendar.update');
    Route::delete('delete/{event_id}', [GoogleCalendarController::class, 'delete'])->name('google_calendar.delete');
    Route::post('create', [GoogleCalendarController::class, 'create'])->name('google_calendar.create');
});


