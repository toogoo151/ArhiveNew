<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Salbar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;


class SalbarController extends Controller
{
    // public function getAngi()
    // {

    //     $angi = DB::table("db_angi")
    //         ->get();

    //     return response()->json($angi);
    // }


    public function getAngiID(Request $req)
    {
        try {
            $getUnits = DB::table("db_angi")->where("comand_id", "=", $req->id)->get();
            return $getUnits;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Алдаа гарлаа"
                ),
                500
            );
        }
    }

    public function NewSalbar(Request $req)
    {
        try {
            $insertAngi = new Salbar();
            $insertAngi->comand_id = $req->comand_id;
            $insertAngi->angi = $req->angi;
            $insertAngi->salbar = $req->salbar;
            $insertAngi->t_ner = $req->t_ner;
            $insertAngi->b_ner = $req->b_ner;
            $insertAngi->save();
            return response(
                array(
                    "status" => "success",
                    "msg" => "Амжилттай хадгаллаа."
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
    public function DeleteSalbar(Request $req)
    {
        try {
            $delete = Salbar::find($req->id);
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

    public function EditSalbar(Request $req)
    {
        try {
            $edit = Salbar::find($req->id);
            $edit->comand_id = $req->comand_id;
            $edit->angi = $req->angi;
            $edit->salbar = $req->salbar;
            $edit->t_ner = $req->t_ner;
            $edit->b_ner = $req->b_ner;
            $edit->save();
            return response(
                array(
                    "status" => "success",
                    "msg" => "Амжилттай заслаа."
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
}
