<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Humrug;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;
use App\Imports\HumrugImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;


class HumrugController extends Controller
{
    public function importHumrug(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new HumrugImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }




    public function HumrugType()
    {
        try {
            $HumrugType = DB::table("humrug_type")
                ->get();
            return $HumrugType;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Ажиллагаа татаж чадсангүй."
                ),
                500
            );
        }
    }

    public function NewHumrug(Request $req)
    {
        try {

            $insertHumrug = new Humrug();

            $insertHumrug->humrug_dugaar = $req->humrug_dugaar;

            // encrypt
            $insertHumrug->humrug_ner = $req->humrug_ner
                ? Crypt::encryptString($req->humrug_ner)
                : null;

            $insertHumrug->humrug_zereglel = $req->humrug_zereglel;
            $insertHumrug->anhnii_ognoo = $req->anhnii_ognoo;

            // optional encrypted field
            $insertHumrug->humrug_uurchlult =
                $req->filled('humrug_uurchlult') && $req->humrug_uurchlult != 0
                ? Crypt::encryptString($req->humrug_uurchlult)
                : null;

            $insertHumrug->uurchlult_ognoo = $req->uurchlult_ognoo;

            // encrypt tailbar
            $insertHumrug->humrug_tailbar = $req->humrug_tailbar
                ? Crypt::encryptString($req->humrug_tailbar)
                : null;

            $insertHumrug->userID = Auth::id();

            $insertHumrug->save();

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
    public function DeleteHumrug(Request $req)
    {
        try {
            $delete = Humrug::find($req->id);
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

    public function EditHumrug(Request $req)
    {
        try {

            $edit = Humrug::find($req->id);

            $edit->humrug_dugaar = $req->humrug_dugaar;

            // encrypt
            $edit->humrug_ner = $req->humrug_ner
                ? Crypt::encryptString($req->humrug_ner)
                : null;

            $edit->humrug_zereglel = $req->humrug_zereglel;
            $edit->anhnii_ognoo = $req->anhnii_ognoo;

            // optional encrypted
            $edit->humrug_uurchlult =
                $req->filled('humrug_uurchlult') && $req->humrug_uurchlult != 0
                ? Crypt::encryptString($req->humrug_uurchlult)
                : null;

            $edit->uurchlult_ognoo = $req->uurchlult_ognoo ?? null;

            // encrypt tailbar
            $edit->humrug_tailbar = $req->humrug_tailbar
                ? Crypt::encryptString($req->humrug_tailbar)
                : null;

            $edit->userID = Auth::id();

            $edit->save();

            return response([
                "status" => "success",
                "msg" => "Амжилттай заслаа."
            ], 200);
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => $th->getMessage()
            ], 500);
        }
    }
}
