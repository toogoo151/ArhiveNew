<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SedevZuiModel extends Model
{
    use HasFactory;
    protected $table = 'arhivsedevzaagch';
    public $timestamps = false;
    protected $fillable = [
        'userID',
        'humrug_id',
        'dans_id',
        'zaagch_tobchlol',
        'zaagch_tailal'
    ];

    public function getSedevZui()
    {
        try {
            $sedev = DB::table("arhivsedevzaagch")
                ->where("arhivsedevzaagch.userID", Auth::id())
                ->orderByDesc("arhivsedevzaagch.id")
                ->leftJoin("db_humrug", "db_humrug.id", "=", "arhivsedevzaagch.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "arhivsedevzaagch.dans_id")
                ->select(
                    "arhivsedevzaagch.*",
                    "db_humrug.humrug_ner",
                    "db_humrug.humrug_dugaar",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_dugaar"
                )
                ->get();
            return $sedev;
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
