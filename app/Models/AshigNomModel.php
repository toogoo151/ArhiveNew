<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AshigNomModel extends Model
{
    use HasFactory;
    protected $table = 'arhivashignom';
    public $timestamps = false;

    protected $fillable = [
        'userID',
        'humrug_id',
        'dans_id',
        'nom_dugaar',
        'nom_ners'
    ];

    public function getNom()
    {
        try {
            $ashignom = DB::table("arhivashignom")
                ->where("arhivashignom.userID", Auth::id())
                ->orderByDesc("arhivashignom.id")

                ->leftJoin("db_humrug", "db_humrug.id", "=", "arhivashignom.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "arhivashignom.dans_id")
                ->select(
                    "arhivashignom.*",
                    "db_humrug.humrug_ner",
                    "db_humrug.humrug_dugaar",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_dugaar"
                )
                ->get();
            return $ashignom;
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
