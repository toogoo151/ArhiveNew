<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SecType extends Model
{
    use HasFactory;
    protected $table = 'nuuts_turul';
    public $timestamps = false;

    public function getSectype()
    {
        try {
            $nType = DB::table("nuuts_turul")
                ->get();
            return $nType;
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
