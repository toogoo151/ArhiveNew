<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Humrug extends Model
{
    use HasFactory;
    protected $table = 'db_humrug';
    public $timestamps = false;

    public function getHumrug()
    {
        try {
            $angi = DB::table("db_humrug")
                ->leftJoin("humrug_type", "humrug_type.id", "=", "db_humrug.humrug_uurchlult")
                ->select("db_humrug.*", "humrug_type.HumName")
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
