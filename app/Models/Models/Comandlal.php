<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Comandlal extends Model
{
    use HasFactory;
    protected $table = 'db_comandlal';
    public $timestamps = false;

    public function getComandlal()
    {
        try {
            $missions = DB::table("db_comandlal")
                ->get();
            return $missions;
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Ажиллагаа татаж чадсангүй."
                ),
                500
            );
        }
    }
}
