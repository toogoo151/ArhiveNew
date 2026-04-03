<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TurIlt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use App\Imports\TurIltImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Log\BaingaIltLog;


class TurIltController extends Controller
{
    public function DeleteTurIlt(Request $req)
    {
        try {
            $delete = TurIlt::find($req->id);
            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Өгөгдөл олдсонгүй"
                ], 404);
            }

            BaingaIltLog::create([
                'humrug_id' => $delete->humrug_id,
                'dans_id' => $delete->dans_id,
                'hadgalamj_turul' => 2,
                'hadgalamj_dugaar' => $delete->hadgalamj_dugaar,
                'hadgalamj_zbn' => $delete->hadgalamj_zbn,
                'hergiin_indeks' => $delete->hergiin_indeks,
                'hadgalamj_garchig' => $delete->hadgalamj_garchig,
                'harya_on' => $delete->harya_on,
                'on_ehen' => $delete->on_ehen,
                'on_suul' => $delete->on_suul,
                'huudas_too' => $delete->huudas_too,
                'habsralt_too' => $delete->habsralt_too,
                'jagsaalt_zuildugaar' => $delete->jagsaalt_zuildugaar,
                'hn_tailbar' => $delete->hn_tailbar,

                'h_type' => "5",
                'successful' => "Устгасан",

                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::id(),
                'user_ip' => $req->ip(),
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
            BaingaIltLog::create([
                'humrug_id' => $req->humrug_id,
                'dans_id' => $req->dans_id,
                'hadgalamj_turul' => 2,
                'hadgalamj_dugaar' => $req->hadgalamj_dugaar,
                'hadgalamj_zbn' => Crypt::encryptString($req->hadgalamj_zbn),
                'hergiin_indeks' => $req->hergiin_indeks,
                'hadgalamj_garchig' => Crypt::encryptString($req->hadgalamj_garchig),
                'harya_on' => $req->harya_on,
                'on_ehen' => $req->on_ehen,
                'on_suul' => $req->on_suul,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'jagsaalt_zuildugaar' => $req->jagsaalt_zuildugaar,
                'hn_tailbar' => Crypt::encryptString($req->hn_tailbar),
                'h_type' => "5",
                'successful' => "Нэмсэн",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $insertTurIlt = new TurIlt();
            $insertTurIlt->humrug_id = $req->humrug_id;
            $insertTurIlt->dans_id = $req->dans_id;
            $insertTurIlt->hadgalamj_dugaar = $req->hadgalamj_dugaar;
            $insertTurIlt->hadgalamj_turul = 2;


            $insertTurIlt->hadgalamj_garchig = Crypt::encryptString($req->hadgalamj_garchig);
            $insertTurIlt->hadgalamj_zbn = Crypt::encryptString($req->hadgalamj_zbn);
            $insertTurIlt->hn_tailbar = Crypt::encryptString($req->hn_tailbar);

            $insertTurIlt->hergiin_indeks = $req->hergiin_indeks;
            $insertTurIlt->harya_on = $req->harya_on;
            $insertTurIlt->on_ehen = $req->on_ehen;
            $insertTurIlt->on_suul = $req->on_suul;
            $insertTurIlt->huudas_too = $req->huudas_too;
            $insertTurIlt->habsralt_too = $req->habsralt_too;
            $insertTurIlt->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;

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

            BaingaIltLog::create([
                'humrug_id' => $req->humrug_id,
                'dans_id' => $req->dans_id,
                'hadgalamj_turul' => 2,
                'hadgalamj_dugaar' => $req->hadgalamj_dugaar,
                'hadgalamj_zbn' => Crypt::encryptString($req->hadgalamj_zbn),
                'hergiin_indeks' => $req->hergiin_indeks,
                'hadgalamj_garchig' => Crypt::encryptString($req->hadgalamj_garchig),
                'harya_on' => $req->harya_on,
                'on_ehen' => $req->on_ehen,
                'on_suul' => $req->on_suul,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'jagsaalt_zuildugaar' => $req->jagsaalt_zuildugaar,
                'hn_tailbar' => Crypt::encryptString($req->hn_tailbar),
                'h_type' => "5",
                'successful' => "Зассан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $edit = TurIlt::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hadgalamj_turul = 2;
            $edit->hadgalamj_dugaar = $req->hadgalamj_dugaar;


            $edit->hadgalamj_garchig = Crypt::encryptString($req->hadgalamj_garchig);
            $edit->hadgalamj_zbn = Crypt::encryptString($req->hadgalamj_zbn);
            $edit->hn_tailbar = Crypt::encryptString($req->hn_tailbar);

            $edit->hergiin_indeks = $req->hergiin_indeks;
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

    public function ArchiveTurIlt(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = TurIlt::find($item['id']);
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

    public function importTurIlt(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new TurIltImport(
            $request->humrug_id,
            $request->dans_id
        ), $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
