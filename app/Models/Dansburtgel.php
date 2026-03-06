<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Dansburtgel extends Model
{
    use HasFactory;
    protected $table = 'db_arhivdans';
    public $timestamps = false;




    protected static function booted()
    {
        static::created(function (Dansburtgel $dans) {
            if (empty($dans->desk_id)) {
                $dans->desk_id = $dans->id;
                $dans->saveQuietly();
            }
        });
    }

    public function getDans()
    {
        try {
            $userId = Auth::id();
            $dans = DB::table('db_arhivdans as d')
                ->join('db_humrug as h', 'h.id', '=', 'd.humrugID')
                ->join('retention_period as r', 'r.RetName', '=', 'd.hadgalah_hugatsaa')
                ->join('secret_type as s', 's.Sname', '=', 'd.dans_baidal')
                ->where("d.user_id", "=", $userId)
                ->select(
                    'd.*',
                    'h.humrug_ner',
                    's.Sname',
                    'r.RetName'
                )
                ->whereRaw('d.id IN (SELECT MIN(id) FROM db_arhivdans GROUP BY id)') // <--- Давхар мөр арилгах
                ->orderByDesc("d.id")
                ->get();
            return $dans;
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

    public function getHumrugs()
    {
        try {
            $userId = Auth::id();

            $humrug = DB::table("db_humrug")
                ->where("db_humrug.userID", "=", $userId)

                ->get();
            return $humrug;
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

    public function getRetention()
    {
        try {
            $dans = DB::table("retention_period")
                ->get();
            return $dans;
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

    public function getSecType()
    {
        try {
            $dans = DB::table("secret_type")
                ->get();
            return $dans;
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
}
