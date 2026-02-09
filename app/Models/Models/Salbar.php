<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class Salbar extends Model
{
    use HasFactory;
    protected $table = 'db_salbar';
    public $timestamps = false;

    public function getSalbar()
    {
        try {
            $salbar = DB::table("db_salbar")
                ->join("db_comandlal", "db_comandlal.id", "=", "db_salbar.comand_id")
                ->join("db_angi", "db_angi.id", "=", "db_salbar.angi")
                ->select("db_salbar.*", "db_comandlal.ShortName", "db_comandlal.id as comandlalIDshuu", "db_angi.ner", "db_angi.id as unitIDshuu")->get();
            return $salbar;

            // $salbar = DB::table("db_salbar")
            //     ->join("db_angi", "db_angi.id", "=", "db_salbar.angi")
            //     ->select("db_salbar.*", "db_angi.ner")
            //     ->get();
            // return $salbar;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Салбар татаж чадсангүй."
                ),
                500
            );
        }
    }
}
