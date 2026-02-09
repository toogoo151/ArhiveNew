<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProgrammType extends Model
{
    use HasFactory;
    protected $table = 'programm_type';
    public $timestamps = false;

    public function getPtype()
    {
        try {
            $pType = DB::table("programm_type")
                ->get();
            return $pType;
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
