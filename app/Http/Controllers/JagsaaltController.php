<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\jagsaaltZuilDugaar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;


class JagsaaltController extends Controller
{
    public function NewJagsaalt(Request $req)
    {
        try {
            $insertJagsaalt = new jagsaaltZuilDugaar();
            $insertJagsaalt->userID = Auth::id();
            $insertJagsaalt->jagsaalt_turul = $req->jagsaalt_turul;
            $insertJagsaalt->barimt_dd = $req->barimt_dd;
            $insertJagsaalt->barimt_turul = $req->barimt_turul;
            $insertJagsaalt->barimt_dedturul = $req->barimt_dedturul;
            $insertJagsaalt->barimt_ner = $req->barimt_ner;
            $insertJagsaalt->hugatsaa_turul = $req->hugatsaa_turul;
            $insertJagsaalt->hugatsaa = $req->hugatsaa;
            $insertJagsaalt->tailbar = $req->tailbar;
            $insertJagsaalt->tobchlol = $req->tobchlol;
            $insertJagsaalt->save();
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
    public function DeleteJagsaalt(Request $req)
    {
        try {
            $delete = jagsaaltZuilDugaar::where("id", $req->id)
                ->where("userID", Auth::id())
                ->first();
            if (!$delete) {
                return response(
                    array(
                        "status" => "error",
                        "msg" => "Хандах эрхгүй."
                    ),
                    403
                );
            }
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

    public function EditJagsaalt(Request $req)
    {
        try {
            $edit = jagsaaltZuilDugaar::where("id", $req->id)
                ->where("userID", Auth::id())
                ->first();
            if (!$edit) {
                return response(
                    array(
                        "status" => "error",
                        "msg" => "Хандах эрхгүй."
                    ),
                    403
                );
            }
            $edit->jagsaalt_turul = $req->jagsaalt_turul;
            $edit->barimt_dd = $req->barimt_dd;
            $edit->barimt_turul = $req->barimt_turul;
            $edit->barimt_dedturul = $req->barimt_dedturul;
            $edit->barimt_ner = $req->barimt_ner;
            $edit->hugatsaa_turul = $req->hugatsaa_turul;
            $edit->hugatsaa = $req->hugatsaa;
            $edit->tailbar = $req->tailbar;
            $edit->tobchlol = $req->tobchlol;
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
