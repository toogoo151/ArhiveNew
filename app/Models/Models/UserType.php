<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserType extends Model
{
    use HasFactory;
    protected $table = 'user_type';
    public $timestamps = false;

    public function getUtype()
    {
        try {
            $uType = DB::table("user_type")
                ->get();
            return $uType;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Татаж чадсангүй."
                ),
                500
            );
        }
    }
}
