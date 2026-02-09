<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Legal;
use App\Models\HeaderMenu;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FrontendController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function showBlade()
    {
        return view('welcome');
        // if(Auth::user()->email_verified_at != null){
        //         return view('welcome');
        //         // return Auth::user();
        //     }else{
        //         return view('auth.verify');
        //     }
        // if(Auth::user()->user_type == "superAdmin" || Auth::user()->user_type == "comandlalAdmin" || Auth::user()->user_type == "unitAdmin"){


        // }
        // else{
        //     return view('NotAccess');
        // }
        // return view('welcome');
    }

    public function login(Request $request)
    {
        // Perform login logic using Laravel's authentication system
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Authentication successful
            return redirect()->route('home');
        } else {
            // Authentication failed
            return redirect()->back()->withErrors('Login failed. Please try again.');
        }
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('home');
    }
}
