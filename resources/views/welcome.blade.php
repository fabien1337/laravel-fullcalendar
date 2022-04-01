@extends('layouts.app')
@section('title', "Laravel Full Calendar")

@section('css')
    <link rel="stylesheet" href="{{ asset('plugins/fullcalendar-5.10.2/lib/main.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
@endsection

@section('content')
    <div id="calendar"
        data-token="{{ csrf_token() }}"
        data-locale="{{ config('app.locale') }}"
        data-url-events="{{ route('api.events.index') }}"
        data-url-store="{{ route('api.events.store') }}"
        data-url-update="{{ route('api.events.update', ':event') }}"
        data-url-delete="{{ route('api.events.destroy', ':event') }}"
        data-url-gc-update="{{ route('api.google_calendar.update', ':event_id') }}"
        data-url-gc-delete="{{ route('api.google_calendar.delete', ':event_id') }}"
        data-url-gc-create="{{ route('api.google_calendar.create') }}"></div>
@endsection

@section('js')
    <script src="{{ asset('js/functions.js') }}"></script>
    <script src="{{ asset('plugins/fullcalendar-5.10.2/lib/main.min.js') }}"></script>
    <script src="{{ asset('plugins/fullcalendar-5.10.2/lib/locales-all.min.js') }}"></script>
    <script src="{{ asset('plugins/sweetalert2@11.js') }}"></script>
    <script src="{{ asset('js/script.js') }}"></script>
@endsection