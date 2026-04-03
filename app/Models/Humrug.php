<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use App\Models\User;


class Humrug extends Model
{
    use HasFactory;
    protected $table = 'db_humrug';
    public $timestamps = false;

    protected $fillable = [
        'desk_id',
        'humrug_dugaar',
        'humrug_ner',
        'humrug_zereglel',
        'anhnii_ognoo',
        'humrug_uurchlult',
        'uurchlult_ognoo',
        'humrug_tailbar',
        'userID',
    ];



    // protected static function booted()
    // {
    //     static::created(function (Humrug $humrug) {
    //         if (empty($humrug->desk_id)) {
    //             $humrug->desk_id = $humrug->id;
    //             $humrug->saveQuietly();
    //         }
    //     });
    // }
    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('userID', $sharedUserIds);
    }

    public function getHumrug()
    {
        try {
            $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
            $angi = DB::table("db_humrug")
                ->leftJoin("humrug_type", "humrug_type.id", "=", "db_humrug.humrug_uurchlult")
                ->select("db_humrug.*", "humrug_type.HumName")
                ->whereIn("db_humrug.userID", $sharedUserIds)

                ->orderByDesc("db_humrug.id")
                ->get()
                ->map(function ($item) {
                    // decrypt хийх
                    $item->humrug_ner = $item->humrug_ner ? Crypt::decryptString($item->humrug_ner) : null;
                    $item->humrug_uurchlult = $item->humrug_uurchlult ? Crypt::decryptString($item->humrug_uurchlult) : null;
                    $item->humrug_tailbar = $item->humrug_tailbar ? Crypt::decryptString($item->humrug_tailbar) : null;
                    return $item;
                });
            return $angi;
        } catch (\Throwable $th) {
            return $th;

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
