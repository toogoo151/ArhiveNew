<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\SecretTypeImport;
use Maatwebsite\Excel\Facades\Excel;

class SecretTypeController extends Controller
{
    public function importSecretTypeTuslah(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new SecretTypeImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
