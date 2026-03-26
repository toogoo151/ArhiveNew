<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DalanJilSanhuu;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Redirect, Response, File;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Imports\DalanJilSanhuuImport;


class DalanJilSanhuuController extends Controller
{
    public function ArchiveDalanJilSanhuu(Request $req)
    {
        try {
            foreach ($req->data as $item) {
                $archive = DalanJilSanhuu::find($item['id']);
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

    public function DeleteDalanJilSanhuu(Request $req)
    {
        try {
            $delete = DalanJilSanhuu::find($req->id);
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

    public function NewDalanJilSanhuu(Request $req)
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
            $insertDalhun = new DalanJilSanhuu();
            $insertDalhun->humrug_id = $req->humrug_id;
            $insertDalhun->dans_id = $req->dans_id;
            $insertDalhun->hadgalamj_dugaar = $req->hadgalamj_dugaar;
            $insertDalhun->hadgalamj_turul = 1;


            $insertDalhun->hadgalamj_garchig = Crypt::encryptString($req->hadgalamj_garchig);
            $insertDalhun->hadgalamj_zbn = Crypt::encryptString($req->hadgalamj_zbn);
            $insertDalhun->hn_tailbar = Crypt::encryptString($req->hn_tailbar);

            $insertDalhun->hergiin_indeks = $req->hergiin_indeks;
            $insertDalhun->harya_on = $req->harya_on;
            $insertDalhun->on_ehen = $req->on_ehen;
            $insertDalhun->on_suul = $req->on_suul;
            $insertDalhun->huudas_too = $req->huudas_too;
            $insertDalhun->habsralt_too = $req->habsralt_too;
            $insertDalhun->jagsaalt_zuildugaar = $req->jagsaalt_zuildugaar;
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

    public function EditDalanJilSanhuu(Request $req)
    {
        try {
            $edit = DalanJilSanhuu::find($req->id);
            $edit->humrug_id = $req->humrug_id;
            $edit->dans_id = $req->dans_id;
            $edit->hadgalamj_turul = 1;
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

    public function ImportJilSanhuu(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(
            new DalanJilSanhuuImport(
                $request->humrug_id,
                $request->dans_id
            ),
            $request->file('file')
        );

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }

    // public function ArchiveBaingIlt(Request $req)
    // {
    //     try {
    //         foreach ($req->data as $item) {
    //             $archive = DalanJilSanhuu::find($item['id']);
    //             if ($archive) {
    //                 $archive->ustgasan_temdeglel = $item['ustgasan_temdeglel'];
    //                 $archive->save();
    //             }
    //         }

    //         return response([
    //             "status" => "success",
    //             "msg" => "Сонгосон баримтууд амжилттай архивлагдлаа."
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "Алдаа гарлаа."
    //         ], 500);
    //     }
    // }
}
