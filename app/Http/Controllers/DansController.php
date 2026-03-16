<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dansburtgel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;
use App\Imports\DansImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;


class DansController extends Controller
{

    public function importDansburtgel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new DansImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
    public function DeleteDans(Request $req)
    {
        try {
            $delete = Dansburtgel::find($req->id);
            $delete->delete();
            return response(
                array(
                    "status" => "success",
                    "msg" => "Амжилттай устгалаа."
                ),
                200
            );
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Алдаа гарлаа."
                ),
                500
            );
        }
    }

    public function NewDans(Request $req)
    {
        $req->validate([
            'humrugID' => 'required|integer',
            'dans_dugaar' => 'required',
            'dans_ner' => 'required',
        ]);

        try {

            $insertDans = new Dansburtgel();

            $insertDans->humrugID = $req->humrugID;

            // encrypt хийх талбарууд
            $insertDans->hadgalah_hugatsaa = $req->hadgalah_hugatsaa
                ? Crypt::encryptString($req->hadgalah_hugatsaa)
                : null;

            $insertDans->dans_baidal = $req->dans_baidal
                ? Crypt::encryptString($req->dans_baidal)
                : null;

            $insertDans->dans_dugaar = $req->dans_dugaar;

            $insertDans->dans_ner = Crypt::encryptString($req->dans_ner);

            $insertDans->humrug_niit = $req->humrug_niit;
            $insertDans->dans_niit = $req->dans_niit;
            $insertDans->on_ehen = $req->on_ehen;
            $insertDans->on_suul = $req->on_suul;

            $insertDans->hubi_dans = $req->hubi_dans
                ? Crypt::encryptString($req->hubi_dans)
                : null;

            $insertDans->dans_tailbar = $req->dans_tailbar
                ? Crypt::encryptString($req->dans_tailbar)
                : null;

            $insertDans->user_id = Auth::id();

            $insertDans->save();

            return response([
                "status" => "success",
                "msg" => "Амжилттай хадгаллаа."
            ], 200);
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => $th->getMessage()
            ], 500);
        }
    }
    public function EditDans(Request $req)
    {
        try {

            $edit = Dansburtgel::find($req->id);

            $edit->humrugID = $req->humrugID;

            $edit->hadgalah_hugatsaa = $req->hadgalah_hugatsaa
                ? Crypt::encryptString($req->hadgalah_hugatsaa)
                : null;

            $edit->dans_baidal = $req->dans_baidal
                ? Crypt::encryptString($req->dans_baidal)
                : null;

            $edit->dans_dugaar = $req->dans_dugaar;

            $edit->dans_ner = $req->dans_ner
                ? Crypt::encryptString($req->dans_ner)
                : null;

            $edit->humrug_niit = $req->humrug_niit;
            $edit->dans_niit = $req->dans_niit;
            $edit->on_ehen = $req->on_ehen;
            $edit->on_suul = $req->on_suul;

            $edit->hubi_dans = $req->hubi_dans
                ? Crypt::encryptString($req->hubi_dans)
                : null;

            $edit->dans_tailbar = $req->dans_tailbar
                ? Crypt::encryptString($req->dans_tailbar)
                : null;

            $edit->user_id = Auth::id();

            $edit->save();

            return response([
                "status" => "success",
                "msg" => "Амжилттай заслаа."
            ], 200);
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ], 500);
        }
    }
}
