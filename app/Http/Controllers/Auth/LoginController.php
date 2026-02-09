<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\LoginAttempt;
use App\Models\User;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers, ThrottlesLogins;

    protected $maxAttempts = 2;
    protected $decayMinutes = 1;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('hereglegch_ner', 'nuuts_ug');

        // First try standard Laravel authentication
        $successful = Auth::attempt($credentials);

        // If standard auth fails, try manual password verification
        // This handles cases where passwords might be stored differently
        if (!$successful) {
            $user = User::where('hereglegch_ner', $request->hereglegch_ner)->first();

            if ($user) {
                // Check if password is hashed or plain text
                $storedPassword = $user->nuuts_ug;
                $providedPassword = $request->nuuts_ug;

                // Try to verify as hashed password first
                if (\Hash::check($providedPassword, $storedPassword)) {
                    // Password is correct (hashed)
                    Auth::login($user, $request->filled('remember'));
                    $request->session()->regenerate();
                    return redirect()->intended('home');
                }
                // If hash check fails, try plain text comparison (for legacy data)
                elseif ($storedPassword === $providedPassword) {
                    // Password matches as plain text (legacy system)
                    Auth::login($user, $request->filled('remember'));
                    $request->session()->regenerate();
                    return redirect()->intended('home');
                }
                // Password is incorrect
                $error = ['nuuts_ug' => 'Нууц үг буруу.'];
            } else {
                // User does not exist
                $error = ['hereglegch_ner' => 'Бүртгэлгүй цахим хаяг байна.'];
            }

            return redirect()->back()
                ->withInput($request->only('hereglegch_ner'))
                ->withErrors($error);
        }

        // Standard authentication succeeded
        $request->session()->regenerate();
        return redirect()->intended('home');
    }

    public function logout(Request $req)
    {
        $user = $req->user();
        // LoginAttempt::create([
        //     'hereglegch_ner' => $user->hereglegch_ner,
        //     'successful' => "Гарсан",
        //     'user_ip' => $req->ip(),
        // ]);
        Auth::logout();
        Auth::guard('web')->logout();
        session()->invalidate();
        session()->regenerateToken();
        //         $credent = $req->only('email', 'password');
        //          $logout = Auth::attempt($credent);
        //           LoginAttempt::updated([
        //             'logout' => "Гарсан",
        // ]);
        //  if ($logout) {
        return redirect('/');
        // }

    }
}
