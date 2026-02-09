<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BaingaIlt extends Model
{
    use HasFactory;
    protected $table = 'db_arhivbaingahad';
    public $timestamps = false;

    public function getBaingaIlt()
    {
        try {
            $baingaIlt = DB::table("db_arhivbaingahad")
                ->join("db_humrug", "db_humrug.id", "=", "db_arhivbaingahad.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivbaingahad.dans_id")
                ->select(
                    "db_arhivbaingahad.*",
                    "db_humrug.humrug_ner",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa"
                )
                ->where(function ($query) {
                    $query->whereNull("ustgasan_temdeglel")
                        ->orWhere("ustgasan_temdeglel", "");
                })
                ->orderByDesc("db_arhivbaingahad.id")

                ->get();

            return $baingaIlt;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "татаж чадсангүй."
                ),
                500
            );
        }
    }

    public function getArchiveBaingIlt()
    {
        try {
            $ArchivebaingaIlt = DB::table("db_arhivbaingahad")
                ->join(
                    "db_humrug",
                    "db_humrug.id",
                    "=",
                    "db_arhivbaingahad.humrug_id"
                )
                ->leftJoin(
                    "db_arhivdans",
                    "db_arhivdans.id",
                    "=",
                    "db_arhivbaingahad.dans_id"
                )
                ->select(
                    "db_arhivbaingahad.*",
                    "db_humrug.humrug_ner",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa"
                )
                ->whereNotNull("db_arhivbaingahad.ustgasan_temdeglel")
                ->where("db_arhivbaingahad.ustgasan_temdeglel", "!=", "")
                ->get();

            return $ArchivebaingaIlt;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй."
            ], 500);
        }
    }


    public function getDansburtgelByHumrug($humrugID)
    {
        try {
            $dans = DB::table("db_arhivdans")
                ->join("db_humrug", "db_humrug.id", "=", "db_arhivdans.humrugID")
                ->where("db_arhivdans.hadgalah_hugatsaa", "Байнга хадгалагдах")
                ->where("db_arhivdans.dans_baidal", "Илт")
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
