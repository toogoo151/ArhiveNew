<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

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

    public static function decryptIfNeeded($value)
    {
        if ($value === null || $value === '') {
            return $value;
        }

        try {
            return Crypt::decryptString($value);
        } catch (\Throwable $th) {
            return $value;
        }
    }


    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }
    public function getTovchlol()
    {
        try {
            $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

            $tovchlol = DB::table("arhivtovchlol")
                ->whereIn("arhivtovchlol.userID", $sharedUserIds)

                ->orderByDesc("arhivtovchlol.id")
                ->leftJoin("db_humrug", "db_humrug.id", "=", "arhivtovchlol.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "arhivtovchlol.dans_id")
                ->select(
                    "arhivtovchlol.*",
                    "db_humrug.humrug_ner",
                    "db_humrug.humrug_dugaar",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_dugaar"
                )->get();

            $tovchlol->transform(function ($s) {

                if (isset($s->humrug_ner)) {
                    $s->humrug_ner = self::decryptIfNeeded($s->humrug_ner);
                }
                if (isset($s->dans_ner)) {
                    $s->dans_ner = self::decryptIfNeeded($s->dans_ner);
                }
                return $s;
            });
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
