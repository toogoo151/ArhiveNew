<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BaingaNuuts;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;

class BaingaNuutsController extends Controller
{

    public function ArchiveBaingNuuts(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = BaingaNuuts::find($item['id']);
                if ($archive) {
                    $archive->ustgasan_temdeglel = $item['ustgasan_temdeglel'];
                    $archive->save();
                }
            }

            return response([
                "status" => "success",
                "msg" => "Сонгосон баримтууд амжилттай архивлагдлаа."
            ], 200);
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ], 500);
        }
    }

    public function DeleteBaingaNuuts(Request $req)
    {
        try {
            $delete = BaingaNuuts::find($req->id);
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

    public function NewBaingaNuuts(Request $req)
    {

        // $req->validate([
        //     'humrugID' => 'required|integer',
        //     'hadgalah_hugatsaa' => 'required|integer',
        //     'dans_dugaar' => 'required',
        //     'dans_ner' => 'required',
        //     'dans_baidal' => 'required',
        //     'hubi_dans' => 'required',

        // ]);

        try {
            $insertBaingaNuuts = new BaingaNuuts();
            $insertBaingaNuuts->humrug_id = $req->humrug_id;
            $insertBaingaNuuts->dans_id = $req->dans_id;
            $insertBaingaNuuts->hn_dd = $req->hn_dd;
            $insertBaingaNuuts->hn_turul = 0;
            $insertBaingaNuuts->hn_zbn = $req->hn_zbn;
            $insertBaingaNuuts->hereg_burgtel = $req->hereg_burgtel;
            $insertBaingaNuuts->harya_on = $req->harya_on;
            $insertBaingaNuuts->hn_garchig = $req->hn_garchig;
            $insertBaingaNuuts->nuuts_zereglel = $req->nuuts_zereglel;
            $insertBaingaNuuts->on_ehen = $req->on_ehen;
            $insertBaingaNuuts->on_suul = $req->on_suul;
            $insertBaingaNuuts->huudas_too = $req->huudas_too;
            $insertBaingaNuuts->habsralt_too = $req->habsralt_too;
            $insertBaingaNuuts->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
            $insertBaingaNuuts->hn_tailbar = $req->hn_tailbar;
            // $insertBainga->dans_tailbar = $req->dans_tailbar;
            $insertBaingaNuuts->user_id = Auth::id();
            $insertBaingaNuuts->save();
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

    public function EditBaingaNuuts(Request $req)
    {
        try {
            $edit = BaingaNuuts::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hn_dd = $req->hn_dd;
            $edit->hn_turul = 0;
            $edit->hn_zbn = $req->hn_zbn;
            $edit->hereg_burgtel = $req->hereg_burgtel;
            $edit->harya_on = $req->harya_on;
            $edit->hn_garchig = $req->hn_garchig;
            $edit->nuuts_zereglel = $req->nuuts_zereglel;
            $edit->on_ehen = $req->on_ehen;
            $edit->on_suul = $req->on_suul;
            $edit->huudas_too = $req->huudas_too;
            $edit->habsralt_too = $req->habsralt_too;
            $edit->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
            $edit->hn_tailbar = $req->hn_tailbar;
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
