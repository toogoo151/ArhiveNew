<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;




class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hereglegch_ner',
        'nuuts_ug',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'nuuts_ug',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    use HasFactory;
    protected $table = 'db_user';
    public $timestamps = true;

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'id';
    }
    public function getUserName()
    {
        return $this->hereglegch_ner ?? 'Нэр олдсонгүй';
    }

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

    public function getHereglegchNerAttribute($value)
    {
        return self::decryptIfNeeded($value);
    }
    public function getTuvshin()
    {
        return $this->barimt_turul ?? 'Түвшин олдсонгүй';
    }
    public function scopeWithSharedAccess($query, $user)
    {
        return $query->where('comand_id', $user->comand_id)
            ->where('angi_id', $user->angi_id)
            ->where('salbar_id', $user->salbar_id);
    }

    public function getUser()
    {
        try {
            $user = DB::table("db_user")
                ->join("db_comandlal", "db_comandlal.id", "=", "db_user.comand_id")
                ->leftJoin("db_angi", "db_angi.id", "=", "db_user.angi_id")
                ->leftJoin("db_salbar", "db_salbar.id", "=", "db_user.salbar_id")
                ->leftJoin("programm_type", "programm_type.id", "=", "db_user.userType")
                ->leftJoin("user_type", "user_type.id", "=", "db_user.tubshin")
                // ->leftJoin("nuuts_turul", "nuuts_turul.id", "=", "db_user.tubshin")
                ->orderBy("db_user.id", "DESC")
                ->select("db_user.*", "db_comandlal.ShortName", "db_comandlal.id as comandlalIDshuu", "db_angi.ner", "db_angi.id as unitIDshuu", "db_salbar.salbar", "db_salbar.id as salbarIDshuu", "programm_type.Pname", "user_type.Uname")
                ->get();

            $user->transform(function ($u) {
                // if (isset($u->hereglegch_ner)) {
                //     $u->hereglegch_ner = self::decryptIfNeeded($u->hereglegch_ner);
                // }
                if (isset($u->salbar)) {
                    $u->salbar = self::decryptIfNeeded($u->salbar);
                }
                return $u;
            });
            return $user;
        } catch (\Throwable $th) {
            return $th;
            return response(
                array(
                    "status" => "error",
                    "msg" => "Салбар татаж чадсангүй."
                ),
                500
            );
        }
    }




    /**
     * Get the password for authentication.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->nuuts_ug;
    }
}
