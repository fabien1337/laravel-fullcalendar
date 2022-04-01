<?php

namespace App\Http\Controllers;

class CalendarController extends Controller
{
    public function index()
    {   
        // dd(\Carbon\Carbon::parse('2022-04-06T03:00:00+02:00'));
        // dd(now('UTC'));
        return view('welcome');
    }
}
