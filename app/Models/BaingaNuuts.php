<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BaingaNuuts extends Model
{
    use HasFactory;
    protected $table = 'db_arhivhnnuuts';
    public $timestamps = false;

    // public function getBaingaNuuts()
    // {
    //     try {
    //         $baingaNuuts = DB::table("db_arhivhnnuuts")
    //             ->join("db_humrug", "db_humrug.humrug_dugaar", "=", "db_arhivhnnuuts.humrug_id")
    //             ->leftjoin("db_arhivdans", "db_arhivdans.dans_dugaar", "=", "db_arhivhnnuuts.dans_id")
    //             ->select("db_arhivhnnuuts.*", "db_humrug.humrug_ner", "db_arhivdans.dans_ner")
    //             ->get();
    //         return $baingaNuuts;
    //     } catch (\Throwable $th) {
    //         return response(
    //             array(
    //                 "status" => "error",
    //                 "msg" => "татаж чадсангүй."
    //             ),
    //             500
    //         );
    //     }
    // }

    public function getArchiveBaingNuuts()
    {
        try {

            $ArchivebaingaNuuts = DB::table("db_arhivhnnuuts")
                ->select(
                    "db_arhivhnnuuts.*",

                    // humrug нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT humrug_ner 
              FROM db_humrug 
              WHERE db_humrug.ud = db_arhivhnnuuts.humrug_id 
              LIMIT 1) as humrug_ner"),

                    // dans нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT dans_ner 
              FROM db_arhivdans 
              WHERE db_arhivdans.id = db_arhivhnnuuts.dans_id 
              LIMIT 1) as dans_ner"),

                    // db_arhivdans доторх dans_baidal утгыг нэмэх
                    "db_arhivdans.dans_baidal",

                    // db_arhivdans доторх hadgalah_hugatsaa утгыг нэмэх
                    "db_arhivdans.hadgalah_hugatsaa"
                )
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivhnnuuts.dans_id")
                ->whereNotNull("db_arhivhnnuuts.ustgasan_temdeglel")
                ->where("db_arhivhnnuuts.ustgasan_temdeglel", "!=", "")

                ->orderByDesc("db_arhivhnnuuts.id")
                ->get();

            return $ArchivebaingaNuuts;



            // $ArchivebaingaNuuts = DB::table("db_arhivhnnuuts")
            //     ->join(
            //         "db_humrug",
            //         "db_humrug.humrug_dugaar",
            //         "=",
            //         "db_arhivhnnuuts.humrug_id"
            //     )
            //     ->leftJoin(
            //         "db_arhivdans",
            //         "db_arhivdans.dans_dugaar",
            //         "=",
            //         "db_arhivhnnuuts.dans_id"
            //     )
            //     ->select(
            //         "db_arhivhnnuuts.*",
            //         "db_humrug.humrug_ner",
            //         "db_arhivdans.dans_ner",
            //         "db_arhivdans.dans_baidal",
            //         "db_arhivdans.hadgalah_hugatsaa"
            //     )
            //     ->whereNotNull("db_arhivhnnuuts.ustgasan_temdeglel")
            //     ->where("db_arhivhnnuuts.ustgasan_temdeglel", "!=", "")
            //     ->get();

            // return $ArchivebaingaNuuts;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй."
            ], 500);
        }
    }

    public function getBaingaNuuts()
    {
        try {

            //   $baingaIlt = DB::table("db_arhivhnnuuts")
            //         ->join("db_humrug", "db_humrug.humrug_dugaar", "=", "db_arhivbaingahad.humrug_id")
            //         ->leftJoin("db_arhivdans", "db_arhivdans.dans_dugaar", "=", "db_arhivbaingahad.dans_id")
            //         ->select(
            //             "db_arhivbaingahad.*",
            //             "db_humrug.humrug_ner",
            //             "db_arhivdans.dans_ner",
            //             "db_arhivdans.dans_baidal",
            //             "db_arhivdans.hadgalah_hugatsaa"
            //         )
            //         ->where(function ($query) {
            //             $query->whereNull("ustgasan_temdeglel")
            //                 ->orWhere("ustgasan_temdeglel", "");
            //         })
            //         ->orderByDesc("db_arhivbaingahad.id")

            //         ->get();

            //     return $baingaIlt;
            $baingaNuuts = DB::table("db_arhivhnnuuts")
                ->select(
                    "db_arhivhnnuuts.*",

                    // humrug нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT humrug_ner 
              FROM db_humrug 
              WHERE db_humrug.id = db_arhivhnnuuts.humrug_id 
              LIMIT 1) as humrug_ner"),

                    // dans нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT dans_ner 
              FROM db_arhivdans 
              WHERE db_arhivdans.id = db_arhivhnnuuts.dans_id 
              LIMIT 1) as dans_ner"),

                    // db_arhivdans доторх dans_baidal утгыг нэмэх
                    "db_arhivdans.dans_baidal",

                    // db_arhivdans доторх hadgalah_hugatsaa утгыг нэмэх
                    "db_arhivdans.hadgalah_hugatsaa"
                )
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivhnnuuts.dans_id")
                ->where(function ($query) {
                    $query->whereNull("ustgasan_temdeglel")
                        ->orWhere("ustgasan_temdeglel", "");
                })
                ->orderByDesc("db_arhivhnnuuts.id")
                ->get();

            return $baingaNuuts;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй.",
                "error" => $th->getMessage()
            ], 500);
        }
    }


    public function getDansburtgelByNuutsHumrug($humrugID)
    {
        try {
            $dans = DB::table("db_arhivdans")
                ->join("db_humrug", "db_humrug.id", "=", "db_arhivdans.humrugID")
                ->where("db_arhivdans.hadgalah_hugatsaa", "Байнга хадгалагдах")
                ->where("db_arhivdans.dans_baidal", "Нууц")
                ->where("db_arhivdans.humrugID", $humrugID)
                ->select(
                    "db_arhivdans.id",
                    "db_arhivdans.humrugID",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.humrug_niit",
                    "db_arhivdans.dans_niit",
                    "db_arhivdans.on_ehen",
                    "db_arhivdans.on_suul",
                    "db_arhivdans.hubi_dans",
                    "db_arhivdans.dans_tailbar",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa",
                    DB::raw("MAX(db_humrug.humrug_ner) as humrug_ner")
                )
                ->groupBy(
                    "db_arhivdans.id",
                    "db_arhivdans.humrugID",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.humrug_niit",
                    "db_arhivdans.dans_niit",
                    "db_arhivdans.on_ehen",
                    "db_arhivdans.on_suul",
                    "db_arhivdans.hubi_dans",
                    "db_arhivdans.dans_tailbar",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa",
                )
                ->get();

            return $dans;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "message" => $th->getMessage(),
                "file" => $th->getFile(),
                "line" => $th->getLine(),
            ], 500);
        }
    }
}
