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

    public function getDans()
    {
        try {

            $dans = DB::table('db_arhivdans as d')
                ->join('db_humrug as h', 'h.id', '=', 'd.humrugID')
                ->join('retention_period as r', 'r.RetName', '=', 'd.hadgalah_hugatsaa')
                ->join('secret_type as s', 's.Sname', '=', 'd.dans_baidal')
                ->select(
                    'd.*',
                    'h.humrug_ner',
                    's.Sname',
                    'r.RetName'
                )
                ->whereRaw('d.id IN (SELECT MIN(id) FROM db_arhivdans GROUP BY id)') // <--- Давхар мөр арилгах
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
            $dans = DB::table("db_humrug")
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
