<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TurNuuts;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Imports\TurNuutsImport;
use App\Log\HnNuuts;



class TurNuutsController extends Controller
{

    public function ArchiveTurNuuts(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = TurNuuts::find($item['id']);
                if ($archive) {
                    $archive->ustgasan_temdeglel = Crypt::encryptString($item['ustgasan_temdeglel']);
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
            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }
            HnNuuts::create([
                'humrug_id' => $delete->humrug_id,
                'dans_id' => $delete->dans_id,
                'hn_turul' => 0,
                'hn_dd' => $delete->hn_dd,

                'hn_zbn' => $delete->hn_zbn
                    ? Crypt::encryptString($delete->hn_zbn)
                    : null,

                'hereg_burgtel' => $delete->hereg_burgtel,

                'nuuts_zereglel' => $delete->nuuts_zereglel
                    ? Crypt::encryptString($delete->nuuts_zereglel)
                    : null,

                'hn_garchig' => $delete->hn_garchig
                    ? Crypt::encryptString($delete->hn_garchig)
                    : null,

                'harya_on' => $delete->harya_on,
                'on_ehen' => $delete->on_ehen,
                'on_suul' => $delete->on_suul,
                'huudas_too' => $delete->huudas_too,
                'habsralt_too' => $delete->habsralt_too,
                'jagsaalt_zuildugaar' => $delete->jagsaalt_zuildugaar,

                'hn_tailbar' => $delete->hn_tailbar
                    ? Crypt::encryptString($delete->hn_tailbar)
                    : null,

                'h_type' => "6",
                'successful' => "Устгасан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => request()->ip(),
            ]);
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
            HnNuuts::create([
                'humrug_id' => $req->humrug_id,
                'dans_id' => $req->dans_id,
                'hn_turul' => 2,
                'hn_dd' => $req->hn_dd,
                'hn_zbn' => Crypt::encryptString($req->hn_zbn),
                'hereg_burgtel' => $req->hereg_burgtel,
                'nuuts_zereglel' => Crypt::encryptString($req->nuuts_zereglel),
                'hn_garchig' => Crypt::encryptString($req->hn_garchig),
                'harya_on' => $req->harya_on,
                'on_ehen' => $req->on_ehen,
                'on_suul' => $req->on_suul,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'jagsaalt_zuildugaar' => $req->jagsaalt_zuildugaar,
                'hn_tailbar' => Crypt::encryptString($req->hn_tailbar),
                'h_type' => "6",
                'successful' => "Нэмсэн",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $insertTurNuuts = new TurNuuts();
            $insertTurNuuts->humrug_id = $req->humrug_id;
            $insertTurNuuts->dans_id = $req->dans_id;
            $insertTurNuuts->hn_dd = $req->hn_dd;
            $insertTurNuuts->hn_turul = 2;
            $insertTurNuuts->hereg_burgtel = $req->hereg_burgtel;
            $insertTurNuuts->hn_zbn = Crypt::encryptString($req->hn_zbn);
            $insertTurNuuts->hn_garchig = Crypt::encryptString($req->hn_garchig);
            $insertTurNuuts->hn_tailbar = Crypt::encryptString($req->hn_tailbar);
            $insertTurNuuts->nuuts_zereglel = Crypt::encryptString($req->nuuts_zereglel);
            $insertTurNuuts->harya_on = $req->harya_on;
            $insertTurNuuts->on_ehen = $req->on_ehen;
            $insertTurNuuts->on_suul = $req->on_suul;
            $insertTurNuuts->huudas_too = $req->huudas_too;
            $insertTurNuuts->habsralt_too = $req->habsralt_too;
            $insertTurNuuts->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
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

            HnNuuts::create([
                'humrug_id' => $req->humrug_id,
                'dans_id' => $req->dans_id,
                'hn_turul' => 2,
                'hn_dd' => $req->hn_dd,
                'hn_zbn' => Crypt::encryptString($req->hn_zbn),
                'hereg_burgtel' => $req->hereg_burgtel,
                'nuuts_zereglel' => Crypt::encryptString($req->nuuts_zereglel),
                'hn_garchig' => Crypt::encryptString($req->hn_garchig),
                'harya_on' => $req->harya_on,
                'on_ehen' => $req->on_ehen,
                'on_suul' => $req->on_suul,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'jagsaalt_zuildugaar' => $req->jagsaalt_zuildugaar,
                'hn_tailbar' => Crypt::encryptString($req->hn_tailbar),
                'h_type' => "6",
                'successful' => "Зассан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $edit = TurNuuts::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hn_dd = $req->hn_dd;
            $edit->hn_turul = 2;
            $edit->hn_zbn = Crypt::encryptString($req->hn_zbn);
            $edit->hn_garchig = Crypt::encryptString($req->hn_garchig);
            $edit->nuuts_zereglel = Crypt::encryptString($req->nuuts_zereglel);
            $edit->hn_tailbar = Crypt::encryptString($req->hn_tailbar);
            $edit->hereg_burgtel = $req->hereg_burgtel;
            $edit->harya_on = $req->harya_on;
            $edit->on_ehen = $req->on_ehen;
            $edit->on_suul = $req->on_suul;
            $edit->huudas_too = $req->huudas_too;
            $edit->habsralt_too = $req->habsralt_too;
            $edit->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
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

    public function importTurNuuts(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new TurNuutsImport(
            $request->humrug_id,
            $request->dans_id
        ), $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
