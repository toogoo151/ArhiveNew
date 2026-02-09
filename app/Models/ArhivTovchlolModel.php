<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ArhivTovchlolModel extends Model
{
    use HasFactory;
    protected $table = 'arhivtovchlol';
    public $timestamps = false;
    protected $fillable = [
        'userID',
        'humrug_id',
        'dans_id',
        'tobchlol',
        'tailal'
    ];
    public function getTovchlol()
    {
        try {
            $tovchlol = DB::table("arhivtovchlol")
                ->where("arhivtovchlol.userID", Auth::id())
                ->orderByDesc("arhivtovchlol.id")
                ->leftJoin("db_humrug", "db_humrug.id", "=", "arhivtovchlol.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "arhivtovchlol.dans_id")
                ->select(
                    "arhivtovchlol.*",
                    "db_humrug.humrug_ner",
                    "db_humrug.humrug_dugaar",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_dugaar"
                )
                ->get();
            return $tovchlol;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Амжилтгүй."
                ),
                500
            );
        }
    }
}
