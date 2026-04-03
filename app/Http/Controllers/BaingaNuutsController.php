<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BaingaNuuts;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Imports\BaingaNuutsImport;
use App\Log\HnNuuts;



class BaingaNuutsController extends Controller
{

    public function ArchiveBaingNuuts(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = BaingaNuuts::find($item['id']);
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

    public function DeleteBaingaNuuts(Request $req)
    {
        try {
            $delete = BaingaNuuts::find($req->id);
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

                'h_type' => "2",
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
                    "msg" => $th->getMessage()
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
            HnNuuts::create([
                'humrug_id' => $req->humrug_id,
                'dans_id' => $req->dans_id,
                'hn_turul' => 0,
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
                'h_type' => "2",
                'successful' => "Нэмсэн",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $insertBaingaNuuts = new BaingaNuuts();
            $insertBaingaNuuts->humrug_id = $req->humrug_id;
            $insertBaingaNuuts->dans_id = $req->dans_id;
            $insertBaingaNuuts->hn_dd = $req->hn_dd;
            $insertBaingaNuuts->hn_turul = 0;
            $insertBaingaNuuts->hereg_burgtel = $req->hereg_burgtel;
            $insertBaingaNuuts->hn_zbn = Crypt::encryptString($req->hn_zbn);
            $insertBaingaNuuts->hn_garchig = Crypt::encryptString($req->hn_garchig);
            $insertBaingaNuuts->hn_tailbar = Crypt::encryptString($req->hn_tailbar);
            $insertBaingaNuuts->nuuts_zereglel = Crypt::encryptString($req->nuuts_zereglel);
            $insertBaingaNuuts->harya_on = $req->harya_on;
            $insertBaingaNuuts->on_ehen = $req->on_ehen;
            $insertBaingaNuuts->on_suul = $req->on_suul;
            $insertBaingaNuuts->huudas_too = $req->huudas_too;
            $insertBaingaNuuts->habsralt_too = $req->habsralt_too;
            $insertBaingaNuuts->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
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

            HnNuuts::create([
                'humrug_id' => $req->humrug_id,
                'dans_id' => $req->dans_id,
                'hn_turul' => 0,
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
                'h_type' => "2",
                'successful' => "Зассан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $edit = BaingaNuuts::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hn_dd = $req->hn_dd;
            $edit->hn_turul = 0;
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

    public function importBaingaNuuts(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(
            new BaingaNuutsImport(
                $request->humrug_id,
                $request->dans_id
            ),
            $request->file('file')
        );

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
