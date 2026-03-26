<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;

class Angi extends Model
{
    use HasFactory;
    protected $table = 'db_angi';
    public $timestamps = false;



    public function safeDecrypt($value)
    {
        if (!$value) return null;

        try {
            return Crypt::decryptString($value);
        } catch (\Throwable $e) {
            return $value; // decrypt хийгдээгүй original утгыг буцаана
        }
    }
    public function getAngi()
    {
        try {
            $angi = DB::table("db_angi")
                ->join("db_comandlal", "db_comandlal.id", "=", "db_angi.comand_id")
                ->select("db_angi.*", "db_comandlal.name")
                ->orderBy("db_angi.id", "DESC")
                ->get()
                ->map(function ($item) {
                    $item->name = $this->safeDecrypt($item->name);
                    $item->ner = $this->safeDecrypt($item->ner);
                    return $item;
                });

            return $angi;
        } catch (\Throwable $th) {
            // return $th;
            return response([
                "status" => "error",
                "msg" => "Анги татаж чадсангүй."
            ], 500);
        }
    }
}
