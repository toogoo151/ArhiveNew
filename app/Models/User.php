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




class User extends Authenticatable implements MustVerifyEmail
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
    public function getTuvshin()
    {
        return $this->barimt_turul ?? 'Түвшин олдсонгүй';
    }

    public function getUser()
    {
        try {
            $user = DB::table("db_user")
                ->join("db_comandlal", "db_comandlal.id", "=", "db_user.comand_id")
                ->join("db_angi", "db_angi.id", "=", "db_user.angi_id")
                ->leftJoin("db_salbar", "db_salbar.id", "=", "db_user.salbar_id")
                ->join("programm_type", "programm_type.id", "=", "db_user.barimt_turul")
                ->join("user_type", "user_type.id", "=", "db_user.bichig_turul")
                ->join("nuuts_turul", "nuuts_turul.id", "=", "db_user.tubshin")
                ->select("db_user.*", "db_comandlal.ShortName", "db_comandlal.id as comandlalIDshuu", "db_angi.ner", "db_angi.id as unitIDshuu", "db_salbar.salbar", "db_salbar.id as salbarIDshuu", "programm_type.Pname", "user_type.Uname", "nuuts_turul.Nname")->get();
            return $user;
        } catch (\Throwable $th) {
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
