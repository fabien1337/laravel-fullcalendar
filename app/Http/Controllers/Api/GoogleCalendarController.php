<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\GoogleCalendar\Event as GoogleCalendar;
use Carbon\Carbon;

class GoogleCalendarController extends Controller
{
    public function update(Request $request, string $event_id)
    {
        $event = GoogleCalendar::find($event_id);
        $event->update([
            'name' => $request->title,
            'startDateTime' => Carbon::parse($request->started_at),
            'endDateTime' => Carbon::parse($request->ended_at),
        ]);
        return response()->json(compact('event'));
    }

    public function delete(string $event_id)
    {
        $event = GoogleCalendar::find($event_id);
        $event->delete();
        return response()->json([]);
    }

    public function create(Request $request)
    {
        $event = GoogleCalendar::create([
            'name' => $request->title,
            'startDateTime' => Carbon::parse($request->started_at),
            'endDateTime' => Carbon::parse($request->ended_at),
        ]);
        return response()->json(compact('event'));
    }
}