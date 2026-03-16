<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class SecretTypeTuslah extends Model
{
    use HasFactory;

    protected $table = 'secret_type';
    public $timestamps = false;

    protected $fillable = [
        'Sname',
    ];

    public function getSecretTypeTuslah()
    {
        try {

            $angi = DB::table("secret_type")
                ->orderByDesc("secret_type.id")
                ->get()
                ->map(function ($item) {

                    if ($item->Sname) {
                        try {
                            $item->Sname = Crypt::decryptString($item->Sname);
                        } catch (\Exception $e) {
                            // decrypt болохгүй бол шууд утгыг нь үлдээнэ
                            $item->Sname = $item->Sname;
                        }
                    }

                    return $item;
                });

            return $angi;
        } catch (\Throwable $th) {

            return response(
                [
                    "status" => "error",
                    "msg" => "Өгөгдөл татаж чадсангүй."
                ],
                500
            );
        }
    }
}
