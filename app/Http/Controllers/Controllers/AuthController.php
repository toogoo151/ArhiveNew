<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LoginAttempt;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'hereglegch_ner' => 'required|string',
            'nuuts_ug' => 'required|string',
        ]);

        $credentials = $request->only('hereglegch_ner', 'nuuts_ug');

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            // Regenerate session to prevent session fixation attacks
            $request->session()->regenerate();

            // Successful login, store the login details
            $user = Auth::user();
            $this->storeLoginDetails($user->id, $request->ip());

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'hereglegch_ner' => $user->hereglegch_ner,
                    'user_type' => $user->user_type ?? null,
                ]
            ], 200);
        }

        $user = User::where('hereglegch_ner', $request->hereglegch_ner)->first();

        if ($user) {
            // User exists, so the password must be incorrect
            return response()->json(['message' => 'Нууц үг буруу.'], 401);
        } else {
            // User does not exist
            return response()->json(['message' => 'Хэрэглэгчийн нэр буруу байна.'], 401);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful'
        ], 200);
    }

    private function storeLoginDetails($userId, $ipAddress)
    {
        // Store the login details in your database
        try {
            $user = User::find($userId);
            if ($user) {
                LoginAttempt::create([
                    'hereglegch_ner' => $user->hereglegch_ner,
                    'user_ip' => $ipAddress,
                    'successful' => 'Нэвтэрсэн',
                ]);
            }
        } catch (\Exception $e) {
            // Log error if LoginAttempt table doesn't exist or has different structure
            \Log::error('Failed to store login details: ' . $e->getMessage());
        }
    }
}
