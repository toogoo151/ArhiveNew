<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class Angi extends Model
{
    use HasFactory;
    protected $table = 'db_angi';
    public $timestamps = false;

    public function getAngi()
    {
        try {
            $angi = DB::table("db_angi")
                ->join("db_comandlal", "db_comandlal.id", "=", "db_angi.comand_id")
                ->select("db_angi.*", "db_comandlal.name")
                ->get();
            return $angi;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Анги татаж чадсангүй."
                ),
                500
            );
        }
    }
}
