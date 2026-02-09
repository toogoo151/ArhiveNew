<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Angi;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;


class AngiController extends Controller
{
    // public function getAngi()
    // {

    //     $angi = DB::table("db_angi")
    //         ->get();

    //     return response()->json($angi);
    // }


    public function NewAngi(Request $req)
    {
        try {
            $insertAngi = new Angi();
            $insertAngi->comand_id = $req->comand_id;
            $insertAngi->idangi = $req->idangi;
            $insertAngi->ner = $req->ner;
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
    public function DeleteAngi(Request $req)
    {
        try {
            $delete = Angi::find($req->id);
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

    public function EditAngi(Request $req)
    {
        try {
            $edit = Angi::find($req->id);
            $edit->comand_id = $req->comand_id;
            $edit->idangi = $req->idangi;
            $edit->ner = $req->ner;
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
