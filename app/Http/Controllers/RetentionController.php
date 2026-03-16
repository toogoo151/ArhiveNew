<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\RetentionImport;
use Maatwebsite\Excel\Facades\Excel;

class RetentionController extends Controller
{
    public function importRetention(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new RetentionImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
