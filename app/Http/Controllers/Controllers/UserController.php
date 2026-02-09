<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;



class UserController extends Controller
{

    public function getAngiID(Request $req)
    {
        try {
            $getSalbar = DB::table("db_salbar")->where("angi", "=", $req->id)->get();
            return $getSalbar;
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

    public function getUsers()
    {
        $auth = Auth::user();

        $users = DB::table("db_user")
            ->where("angi_id", $auth->angi_id)
            ->get();

        return response()->json($users);
    }


    public function NewUser(Request $req)
    {
        try {
            $insertUser = new User();
            $insertUser->hereglegch_ner = $req->hereglegch_ner;
            $insertUser->nuuts_ug = Hash::make(123456789);
            // $insertUser->nuuts_ug = $req->nuuts_ug;
            $insertUser->comand_id = $req->comand_id;
            $insertUser->angi_id = $req->angi_id;
            $insertUser->salbar_id = $req->salbar_id;
            $insertUser->barimt_turul = $req->barimt_turul;
            $insertUser->bichig_turul = $req->bichig_turul;
            $insertUser->tubshin = $req->tubshin;
            $insertUser->save();
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

    public function EditUser(Request $req)
    {
        try {
            $edit = User::find($req->id);

            $edit->hereglegch_ner = $req->hereglegch_ner;
            $edit->comand_id      = $req->comand_id;
            $edit->angi_id        = $req->angi_id;
            $edit->salbar_id      = $req->salbar_id ?? null;
            $edit->barimt_turul   = $req->barimt_turul ?? null;
            $edit->bichig_turul   = $req->bichig_turul ?? null;
            $edit->tubshin        = $req->tubshin ?? null;

            // Нууц үг шинэчлэх, хоосон бол хуучнаараа үлдээх
            if ($req->nuuts_ug && trim($req->nuuts_ug) !== "") {
                $edit->nuuts_ug = $req->nuuts_ug;
            }

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

    public function DeleteUser(Request $req)
    {
        try {
            $delete = User::find($req->id);
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
}
