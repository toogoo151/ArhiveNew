<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DalanJilHun;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Illuminate\Support\Str;

class DalanJilHunController extends Controller
{
    public function ArchiveDalanJilHun(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = DalanJilHun::find($item['id']);
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

    public function DeleteDalanJilHun(Request $req)
    {
        try {
            $delete = DalanJilHun::find($req->id);
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

    public function NewDalanJilHun(Request $req)
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
            $insertDalhun = new DalanJilHun();
            $insertDalhun->humrug_id = $req->humrug_id;
            $insertDalhun->dans_id = $req->dans_id;
            $insertDalhun->hadgalamj_dugaar = $req->hadgalamj_dugaar;
            $insertDalhun->hadgalamj_turul = 1;
            $insertDalhun->hadgalamj_garchig = $req->hadgalamj_garchig;
            $insertDalhun->hadgalamj_zbn = $req->hadgalamj_zbn;
            $insertDalhun->hergiin_indeks = $req->hergiin_indeks;
            $insertDalhun->harya_on = $req->harya_on;
            $insertDalhun->on_ehen = $req->on_ehen;
            $insertDalhun->on_suul = $req->on_suul;
            $insertDalhun->huudas_too = $req->huudas_too;
            $insertDalhun->habsralt_too = $req->habsralt_too;
            $insertDalhun->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
            $insertDalhun->hn_tailbar = $req->hn_tailbar;
            // $insertDalhun->dans_tailbar = $req->dans_tailbar;
            $insertDalhun->user_id = Auth::id();
            $insertDalhun->save();
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

    public function EditDalanJilHun(Request $req)
    {
        try {
            $edit = DalanJilHun::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hadgalamj_turul = 1;
            $edit->hadgalamj_dugaar = $req->hadgalamj_dugaar;
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

    public function ArchiveBaingIlt(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = DalanJilHun::find($item['id']);
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
