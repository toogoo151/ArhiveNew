<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BaingaIlt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Imports\BaingaIltImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;


class BaingaIltController extends Controller
{
    public function DeleteBaingIlt(Request $req)
    {
        try {
            $delete = BaingaIlt::find($req->id);
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

    // public function NewBaingIlt(Request $req)
    // {

    //     $req->validate([
    //         'humrugID' => 'required|integer',
    //         'hadgalah_hugatsaa' => 'required|integer',
    //         'dans_dugaar' => 'required',
    //         'dans_ner' => 'required',
    //         'dans_baidal' => 'required',
    //         'hubi_dans' => 'required',

    //     ]);

    //     try {
    //         $insertBainga = new BaingaIlt();
    //         $insertBainga->humrug_id = $req->humrug_id;
    //         $insertBainga->dans_id = $req->dans_id;
    //         $insertBainga->hadgalamj_dugaar = $req->hadgalamj_dugaar;
    //         $insertBainga->hadgalamj_turul = 0;
    //         $insertBainga->hadgalamj_garchig = $req->hadgalamj_garchig;
    //         $insertBainga->hadgalamj_zbn = $req->hadgalamj_zbn;
    //         $insertBainga->hergiin_indeks = $req->hergiin_indeks;
    //         $insertBainga->harya_on = $req->harya_on;
    //         $insertBainga->on_ehen = $req->on_ehen;
    //         $insertBainga->on_suul = $req->on_suul;
    //         $insertBainga->huudas_too = $req->huudas_too;
    //         $insertBainga->habsralt_too = $req->habsralt_too;
    //         $insertBainga->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
    //         $insertBainga->hn_tailbar = $req->hn_tailbar;
    //         // $insertBainga->dans_tailbar = $req->dans_tailbar;
    //         $insertBainga->user_id = Auth::id();
    //         $insertBainga->save();
    //         return response([
    //             "status" => "success",
    //             "msg" => "Амжилттай хадгаллаа."
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => $th->getMessage()
    //         ], 500);
    //     }
    // }
    public function NewBaingIlt(Request $req)
    {
        try {
            $insertBainga = new BaingaIlt();

            $insertBainga->humrug_id = $req->humrug_id;
            $insertBainga->dans_id = $req->dans_id;
            $insertBainga->hadgalamj_dugaar = $req->hadgalamj_dugaar;
            $insertBainga->hadgalamj_turul = 0;


            $insertBainga->hadgalamj_garchig = Crypt::encryptString($req->hadgalamj_garchig);
            $insertBainga->hadgalamj_zbn = Crypt::encryptString($req->hadgalamj_zbn);
            $insertBainga->hn_tailbar = Crypt::encryptString($req->hn_tailbar);

            $insertBainga->hergiin_indeks = $req->hergiin_indeks;
            $insertBainga->harya_on = $req->harya_on;
            $insertBainga->on_ehen = $req->on_ehen;
            $insertBainga->on_suul = $req->on_suul;
            $insertBainga->huudas_too = $req->huudas_too;
            $insertBainga->habsralt_too = $req->habsralt_too;
            $insertBainga->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;

            $insertBainga->user_id = Auth::id();

            $insertBainga->save();

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

    public function EditBaingIlt(Request $req)
    {
        try {
            $edit = BaingaIlt::find($req->id);

            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hadgalamj_turul = 0;
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
                "msg" => $th->getMessage()
            ], 500);
        }
    }

    public function ArchiveBaingIlt(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = BaingaIlt::find($item['id']);

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

    public function importBaingaIlts(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new BaingaIltImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
