<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comandlal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class ComandController extends Controller
{
    public function getComandlal()
    {

        $comandlal = DB::table("db_comandlal")
            ->get();
        $comandlal->transform(function ($row) {
            if (!empty($row->name)) {
                $row->name = $this->decryptIfNeeded($row->name);
            }
            return $row;
        });

        return response()->json($comandlal);
    }

    private function decryptIfNeeded($value)
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value; // fallback if already plain or invalid
        }
    }


    public function NewComandlal(Request $req)
    {
        try {
            $insertComandlal = new Comandlal();
            $insertComandlal->name = Crypt::encryptString($req->name);
            $insertComandlal->ShortName = $req->ShortName;
            $insertComandlal->save();
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

    public function DeleteComandlal(Request $req)
    {
        try {
            $delete = Comandlal::find($req->id);
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

    public function EditComandlal(Request $req)
    {
        try {
            $edit = Comandlal::find($req->id);
            $edit->name = Crypt::encryptString($req->name);
            $edit->ShortName = $req->ShortName;
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
