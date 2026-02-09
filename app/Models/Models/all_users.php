<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class all_users extends Model
{
    use HasFactory;
    protected $table = 'all_users';
    public $timestamps = true;


    public function getUserName()
    {
        $user = DB::table('db_user')
            ->where('id', auth()->id())
            ->first();

        return $user->hereglegch_ner ?? 'Нэр олдсонгүй';
    }



    public function getUserId()
    {
        $getUserId = DB::table("db_user")
            ->where("db_user.id", "=", Auth::user()->id)
            ->select("db_user.id")
            ->first();
        return $getUserId;
    }

    public function getUser()
    {
        $getUserName = DB::table("db_user")
            ->first();

        return response(
            array(
                "userID" => Auth::user()->id,
                "name" => $getUserName->name,
                "userType" => Auth::user()->user_type,
            ),
            201
        );
    }

    public function getUserComandlal()
    {
        $getUserName = DB::table("all_users")
            ->where("all_users.id", "=", Auth::user()->allUsersID)
            ->join("tb_comandlal", function ($query) {
                $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
            })
            ->select("tb_comandlal.*")
            ->first();
        return $getUserName;
    }

    public function getUserUnit()
    {
        $getUserName = DB::table("all_users")
            ->where("all_users.id", "=", Auth::user()->allUsersID)
            ->join("tb_unit", function ($query) {
                $query->on("all_users.unitID", "=", "tb_unit.id");
            })
            ->select("tb_unit.*")
            ->first();
        return $getUserName;
    }

    public function getUserImage()
    {
        $getUserName = DB::table("all_users")
            ->where("all_users.id", "=", Auth::user()->allUsersID)
            ->select("all_users.image")
            ->first()->image;
        return $getUserName;
    }

    public function getComandlalID()
    {
        $getComandlalID = DB::table("all_users")
            ->where("all_users.id", "=", Auth::user()->allUsersID)
            ->select("all_users.comandlalID")
            ->first();
        return $getComandlalID->comandlalID;
    }
    public function getUnitlID()
    {
        $getComandlalID = DB::table("all_users")
            ->where("all_users.id", "=", Auth::user()->allUsersID)
            ->select("all_users.unitID")
            ->first();
        return $getComandlalID->unitID;
    }
}
