<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Spatie\GoogleCalendar\Event as GoogleCalendar;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->start;
        $end = $request->end;

        $events = Event::select('id', 'title', 'started_at as start', 'ended_at as end', 'local_event as type', 'green as backgroundColor', 'green as borderColor', 'true as editable'/*, 'true as allDay'*/)
            ->where('is_active', true);
        if (isset($start)) {
            $events = $events->whereDate('started_at', '>=', $start);
        }
        if (isset($end)) {
            $events = $events->whereDate('ended_at', '<=', $end);
        }
        $events = $events->orWhereNull('ended_at')->get()->toArray();

        if (isset($start) && isset($end)) {
            $starting = Carbon::parse($start);
            $ending = Carbon::parse($end);
            $gcalendarEvents = GoogleCalendar::get($starting, $ending);
        }
        else {
            $gcalendarEvents = GoogleCalendar::get();
        }
        $gcEvents = [];
        foreach ($gcalendarEvents as $row) {
            $gcEvents []= (object)[
                'id' => $row->googleEvent->id,
                'title' => $row->googleEvent->summary,
                'start' => $row->googleEvent->start->date ? $row->googleEvent->start->date.' 00:00:00' : $row->googleEvent->start->dateTime,
                'end' => $row->googleEvent->end->date ? $row->googleEvent->end->date.' 00:00:00' : $row->googleEvent->end->dateTime,
                'type' => 'gcalendar_event',
                'backgroundColor' => 'red',
                'borderColor' => 'red',
                'editable' => true,
            ];
        }

        $events = array_merge($events, $gcEvents);

        return response()->json($events);
    }

    public function store(EventRequest $request)
    {
        $event = Event::firstOrCreate($request->validated());
        return response()->json($event);
    }

    public function update(EventRequest $request, Event $event)
    {
        $event->update($request->validated());
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json([]);
    }
}
