<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Huthereg;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;


class HutheregController extends Controller
{

    public function NewHuthereg(Request $req)
    {
        $req->validate([
            'ognoo' => 'required',
            'des_dugaar' => 'required',
            'indeks' => 'required',
            'garchig' => 'required',
            'hugatsaa' => 'required',
            'alban_tushaal' => 'required',
        ]);

        try {
            $insertHuthereg = new Huthereg();
            $insertHuthereg->ognoo = $req->ognoo;
            $insertHuthereg->des_dugaar = $req->des_dugaar;
            $insertHuthereg->indeks = $req->indeks;
            $insertHuthereg->garchig = $req->garchig;
            $insertHuthereg->hugatsaa = $req->hugatsaa;
            $insertHuthereg->alban_tushaal = $req->alban_tushaal;
            $insertHuthereg->tailbar = $req->tailbar;
            $insertHuthereg->save();

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
    public function DeleteHuthereg(Request $req)
    {
        try {
            $delete = Huthereg::find($req->id);
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

    public function EditHuthereg(Request $req)
    {
        try {
            $edit = Huthereg::find($req->id);
            $edit->ognoo = $req->ognoo;
            $edit->des_dugaar = $req->des_dugaar;
            $edit->indeks = $req->indeks;
            $edit->garchig = $req->garchig;
            $edit->hugatsaa = $req->hugatsaa;
            $edit->alban_tushaal = $req->alban_tushaal;
            $edit->tailbar = $req->tailbar;

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
