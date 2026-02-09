<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TurNuuts;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;

class TurNuutsController extends Controller
{

    public function ArchiveTurNuuts(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = TurNuuts::find($item['id']);
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

    public function DeleteTurNuuts(Request $req)
    {
        try {
            $delete = TurNuuts::find($req->id);
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

    public function NewTurNuuts(Request $req)
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
            $insertTurNuuts = new TurNuuts();
            $insertTurNuuts->humrug_id = $req->humrug_id;
            $insertTurNuuts->dans_id = $req->dans_id;
            $insertTurNuuts->hn_dd = $req->hn_dd;
            $insertTurNuuts->hn_zbn = $req->hn_zbn;
            $insertTurNuuts->hereg_burtgel = $req->hereg_burtgel;
            $insertTurNuuts->harya_on = $req->harya_on;
            $insertTurNuuts->hn_garchig = $req->hn_garchig;
            $insertTurNuuts->nuuts_zereglel = $req->nuuts_zereglel;
            $insertTurNuuts->on_ehen = $req->on_ehen;
            $insertTurNuuts->on_suul = $req->on_suul;
            $insertTurNuuts->huudas_too = $req->huudas_too;
            $insertTurNuuts->habsralt_too = $req->habsralt_too;
            $insertTurNuuts->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
            $insertTurNuuts->hn_tailbar = $req->hn_tailbar;
            // $insertBainga->dans_tailbar = $req->dans_tailbar;
            $insertTurNuuts->user_id = Auth::id();
            $insertTurNuuts->save();
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

    public function EditTurNuuts(Request $req)
    {
        try {
            $edit = TurNuuts::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hn_dd = $req->hn_dd;
            $edit->hn_zbn = $req->hn_zbn;
            $edit->hereg_burtgel = $req->hereg_burtgel;
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
