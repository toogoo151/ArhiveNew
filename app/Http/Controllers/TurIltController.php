<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TurIlt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;

class TurIltController extends Controller
{
    public function DeleteTurIlt(Request $req)
    {
        try {
            $delete = TurIlt::find($req->id);
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

    public function NewTurIlt(Request $req)
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
            $insertTurIlt = new TurIlt();
            $insertTurIlt->humrug_id = $req->humrug_id;
            $insertTurIlt->dans_id = $req->dans_id;
            $insertTurIlt->hadgalamj_dugaar = $req->hadgalamj_dugaar;
            $insertTurIlt->hadgalamj_turul = 2;
            $insertTurIlt->hadgalamj_garchig = $req->hadgalamj_garchig;
            $insertTurIlt->hadgalamj_zbn = $req->hadgalamj_zbn;
            $insertTurIlt->hergiin_indeks = $req->hergiin_indeks;
            $insertTurIlt->harya_on = $req->harya_on;
            $insertTurIlt->on_ehen = $req->on_ehen;
            $insertTurIlt->on_suul = $req->on_suul;
            $insertTurIlt->huudas_too = $req->huudas_too;
            $insertTurIlt->habsralt_too = $req->habsralt_too;
            $insertTurIlt->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
            $insertTurIlt->hn_tailbar = $req->hn_tailbar;
            // $insertTurIlt->dans_tailbar = $req->dans_tailbar;
            $insertTurIlt->user_id = Auth::id();
            $insertTurIlt->save();
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

    public function EditTurIlt(Request $req)
    {
        try {
            $edit = TurIlt::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hadgalamj_dugaar = $req->hadgalamj_dugaar;
            $edit->hadgalamj_turul = 2;
            $edit->hadgalamj_garchig = $req->hadgalamj_garchig;
            $edit->hadgalamj_zbn = $req->hadgalamj_zbn;
            $edit->hergiin_indeks = $req->hergiin_indeks;
            $edit->harya_on = $req->harya_on;
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

    public function ArchiveTurIlt(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = TurIlt::find($item['id']);
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
}
