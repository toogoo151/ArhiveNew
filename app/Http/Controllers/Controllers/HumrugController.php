<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Humrug;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;


class HumrugController extends Controller
{

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

        $req->validate([
            'humrug_dugaar' => 'required',
            'humrug_ner' => 'required',
            'humrug_zereglel' => 'required',
            'anhnii_ognoo' => 'required',

        ]);

        try {
            $insertHumrug = new Humrug();
            $insertHumrug->humrug_dugaar = $req->humrug_dugaar;
            $insertHumrug->humrug_ner = $req->humrug_ner;
            $insertHumrug->humrug_zereglel = $req->humrug_zereglel;
            $insertHumrug->anhnii_ognoo = $req->anhnii_ognoo;
            // $insertHumrug->humrug_uurchlult = $req->humrug_uurchlult;
            $insertHumrug->humrug_uurchlult = $req->filled('humrug_uurchlult') &&
                $req->humrug_uurchlult != 0
                ? $req->humrug_uurchlult
                : null;
            $insertHumrug->uurchlult_ognoo = $req->uurchlult_ognoo;
            $insertHumrug->humrug_tailbar = $req->humrug_tailbar;
            // $insertHumrug->userID = Auth::user()->userID;
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
            $edit->humrug_ner = $req->humrug_ner;
            $edit->humrug_zereglel = $req->humrug_zereglel;
            $edit->anhnii_ognoo = $req->anhnii_ognoo;
            $edit->humrug_uurchlult = $req->humrug_uurchlult ?? null;
            $edit->uurchlult_ognoo = $req->uurchlult_ognoo ?? null;
            $edit->humrug_tailbar = $req->humrug_tailbar ?? null;
            $edit->userID = Auth::id();
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
