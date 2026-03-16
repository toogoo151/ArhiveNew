<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TurIlt extends Model
{
    use HasFactory;
    protected $table = 'db_arhivbaingahad';
    public $timestamps = false;

    protected static function booted()
    {
        static::created(function (TurIlt $turIlt) {
            if (empty($turIlt->desk_id)) {
                $turIlt->desk_id = $turIlt->id;
                $turIlt->saveQuietly();
            }
        });
    }

    public function getTurIlt()
    {
        try {
            $turIlt = DB::table("db_arhivbaingahad")
                ->where("db_arhivbaingahad.user_id", Auth::id())
                ->join("db_humrug", "db_humrug.desk_id", "=", "db_arhivbaingahad.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.desk_id", "=", "db_arhivbaingahad.dans_id")
                ->leftJoin("jagsaaltzuildugaar", function ($join) {
                    $join->on(
                        "jagsaaltzuildugaar.barimt_dd",
                        "=",
                        "db_arhivbaingahad.jagsaalt_zuildugaar"
                    )
                        ->where("jagsaaltzuildugaar.userID", Auth::id());
                })
                ->select(
                    "db_arhivbaingahad.*",
                    "db_humrug.humrug_ner",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa",
                    "jagsaaltzuildugaar.hugatsaa as hugatsaa"
                )
                ->where(function ($query) {
                    $query->whereNull("ustgasan_temdeglel")
                        ->orWhere("ustgasan_temdeglel", "");
                })
                ->orderByDesc("db_arhivbaingahad.id")

                ->get();

            return $turIlt;
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

    public function getArchiveTurIlt()
    {
        try {
            $ArchiveturIlt = DB::table("db_arhivbaingahad")
                ->join(
                    "db_humrug",
                    "db_humrug.desk_id",
                    "=",
                    "db_arhivbaingahad.humrug_id"
                )
                ->leftJoin(
                    "db_arhivdans",
                    "db_arhivdans.desk_id",
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
                ->where("db_arhivbaingahad.user_id", Auth::id())
                ->where("db_arhivbaingahad.ustgasan_temdeglel", "!=", "")
                ->get();

            return $ArchiveturIlt;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй."
            ], 500);
        }
    }


    public function getDansburtgelTurByHumrug($humrugID)
    {
        try {
            $dans = DB::table("db_arhivdans")
                ->join("db_humrug", "db_humrug.desk_id", "=", "db_arhivdans.humrugID")
                ->where("db_arhivdans.hadgalah_hugatsaa", "Түр хадгалагдах")
                ->where("db_arhivdans.dans_baidal", "Илт")
                ->where("db_arhivdans.humrugID", $humrugID)
                ->where("db_arhivdans.user_id", Auth::id())
                ->select(
                    "db_arhivdans.desk_id", // 👈 ADD THIS
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
                    "db_arhivdans.desk_id", // 👈 ADD THIS
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
