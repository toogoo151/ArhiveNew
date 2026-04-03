<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use App\Models\User;


class jagsaaltZuilDugaar extends Model
{
    use HasFactory;
    protected $table = 'jagsaaltzuildugaar';
    public $timestamps = false;
    protected $fillable = [
        'userID',
        'jagsaalt_turul',
        'barimt_dd',
        'barimt_turul',
        'barimt_dedturul',
        'barimt_ner',
        'hugatsaa_turul',
        'hugatsaa',
        'tailbar',
        'tobchlol',
    ];

    // protected static function booted()
    // {
    //     static::created(function (jagsaaltZuilDugaar $jagsaalt) {
    //         if (empty($jagsaalt->desk_id)) {
    //             $jagsaalt->desk_id = $jagsaalt->id;
    //             $jagsaalt->saveQuietly();
    //         }
    //     });
    // }

    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }

    public function getJagsaalt()
    {
        try {
            $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

            $jagsaalt = DB::table("jagsaaltzuildugaar")
                ->whereIn("jagsaaltzuildugaar.userID", $sharedUserIds)
                ->orderByDesc("jagsaaltzuildugaar.id")
                ->leftjoin("jagsaalt_turul", "jagsaalt_turul.id", "=", "jagsaaltzuildugaar.jagsaalt_turul")
                ->join("retention_period", "retention_period.id", "=", "jagsaaltzuildugaar.hugatsaa_turul")
                ->select("jagsaaltzuildugaar.*", "jagsaalt_turul.jName", "retention_period.RetName")
                ->orderByDesc("jagsaaltzuildugaar.id")
                ->get()
                ->map(function ($item) {
                    try {
                        $item->RetName = Crypt::decryptString($item->RetName);
                    } catch (\Exception $e) {
                        $item->RetName = null;
                    }
                    return $item;
                });
            return $jagsaalt;
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
