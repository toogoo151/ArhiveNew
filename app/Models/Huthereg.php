<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Huthereg extends Model
{
    use HasFactory;
    protected $table = 'db_huthereg';
    public $timestamps = true;

    public function getHuthereg()
    {
        try {
            $hereg = DB::table("db_huthereg")
                ->get();
            return $hereg;
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
