<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;


class Dansburtgel extends Model
{
    use HasFactory;
    protected $table = 'db_arhivdans';
    public $timestamps = false;


    protected $fillable = [
        'desk_id',
        'humrugID',
        'dans_dugaar',
        'dans_ner',
        'humrug_niit',
        'dans_niit',
        'on_ehen',
        'on_suul',
        'hubi_dans',
        'dans_tailbar',
        'dans_baidal',
        'hadgalah_hugatsaa',
        'user_id',
    ];




    protected static function booted()
    {
        static::created(function (Dansburtgel $dans) {
            if (empty($dans->desk_id)) {
                $dans->desk_id = $dans->id;
                $dans->saveQuietly();
            }
        });
    }

    // public function getDans()
    // {
    //     try {
    //         $userId = Auth::id();
    //         $dans = DB::table('db_arhivdans as d')
    //             ->join('db_humrug as h', 'h.id', '=', 'd.humrugID')
    //             ->join('retention_period as r', 'r.RetName', '=', 'd.hadgalah_hugatsaa')
    //             ->join('secret_type as s', 's.Sname', '=', 'd.dans_baidal')
    //             ->where("d.user_id", "=", $userId)
    //             ->select(
    //                 'd.*',
    //                 'h.humrug_ner',
    //                 's.Sname',
    //                 'r.RetName'
    //             )
    //             ->whereRaw('d.id IN (SELECT MIN(id) FROM db_arhivdans GROUP BY id)') // <--- Давхар мөр арилгах
    //             ->orderByDesc("d.id")
    //             ->get()
    //             ->map(function ($item) {
    //                 // decrypt хийх
    //                 $item->dans_ner = $item->dans_ner ? Crypt::decryptString($item->dans_ner) : null;
    //                 $item->hubi_dans = $item->hubi_dans ? Crypt::decryptString($item->hubi_dans) : null;
    //                 $item->dans_tailbar = $item->dans_tailbar ? Crypt::decryptString($item->dans_tailbar) : null;
    //                 $item->dans_baidal = $item->dans_baidal ? Crypt::decryptString($item->dans_baidal) : null;
    //                 $item->hadgalah_hugatsaa = $item->hadgalah_hugatsaa ? Crypt::decryptString($item->hadgalah_hugatsaa) : null;
    //                 return $item;
    //             });
    //         return $dans;
    //     } catch (\Throwable $th) {
    //         return response(
    //             array(
    //                 "status" => "error",
    //                 "msg" => "татаж чадсангүй."
    //             ),
    //             500
    //         );
    //     }
    // }

    public function safeDecrypt($value)
    {
        if (!$value) return null;

        try {
            return Crypt::decryptString($value);
        } catch (\Throwable $e) {
            return $value; // decrypt хийгдээгүй original утгыг буцаана
        }
    }

    public function getDans()
    {
        try {
            $userId = Auth::id();

            $dans = DB::table('db_arhivdans as d')
                ->join('db_humrug as h', 'h.desk_id', '=', 'd.humrugID')
                ->where("d.user_id", $userId)
                ->select('d.*', 'h.humrug_ner')
                ->orderByDesc("d.id")
                ->get()
                ->map(function ($item) {

                    $item->humrug_ner = $this->safeDecrypt($item->humrug_ner);
                    $item->dans_ner = $this->safeDecrypt($item->dans_ner);
                    $item->hubi_dans = $this->safeDecrypt($item->hubi_dans);
                    $item->dans_tailbar = $this->safeDecrypt($item->dans_tailbar);
                    $item->dans_baidal = $this->safeDecrypt($item->dans_baidal);
                    $item->hadgalah_hugatsaa = $this->safeDecrypt($item->hadgalah_hugatsaa);

                    return $item;
                });

            return $dans;
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй."
            ], 500);
        }
    }

    public function getHumrugs()
    {
        try {
            $userId = Auth::id();

            $humrug = DB::table("db_humrug")
                ->where("db_humrug.userID", "=", $userId)
                ->get()
                ->map(function ($item) {
                    // decrypt хийх
                    $item->humrug_ner = $item->humrug_ner ? Crypt::decryptString($item->humrug_ner) : null;

                    return $item;
                });
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
                ->get()
                ->map(function ($item) {
                    // decrypt хийх
                    $item->RetName = $item->RetName ? Crypt::decryptString($item->RetName) : null;
                    return $item;
                });
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
                ->get()
                ->map(function ($item) {
                    // decrypt хийх
                    $item->Sname = $item->Sname ? Crypt::decryptString($item->Sname) : null;
                    return $item;
                });
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
