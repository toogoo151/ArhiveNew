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

    public function getAngi()
    {
        try {
            $angi = DB::table("db_angi")
                ->join("db_comandlal", "db_comandlal.id", "=", "db_angi.comand_id")
                ->select("db_angi.*", "db_comandlal.name")
                ->orderBy("db_angi.id", "DESC")
                ->get();


            $angi->transform(function ($item) {
                if (!empty($item->ner)) {
                    try {
                        $item->ner = Crypt::decryptString($item->ner);
                    } catch (\Throwable $e) {
                        // If it's already plain (or decryption fails), return as-is.
                        $item->ner;
                    }
                }
                if (!empty($item->name)) {
                    try {
                        $item->name = Crypt::decryptString($item->name);
                    } catch (\Throwable $e) {
                        // If it's already plain (or decryption fails), return as-is.
                        $item->name;
                    }
                }
                return $item;
            });

            return $angi;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Анги татаж чадсангүй."
            ], 500);
        }
    }
}
