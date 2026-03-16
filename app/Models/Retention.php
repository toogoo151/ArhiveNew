<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class Retention extends Model
{
    use HasFactory;

    protected $table = 'retention_period';
    public $timestamps = false;

    protected $fillable = [
        'RetName',
    ];

    public function getRetentionTuslah()
    {
        try {

            $angi = DB::table("retention_period")
                ->orderByDesc("retention_period.id")
                ->get()
                ->map(function ($item) {

                    if ($item->RetName) {
                        try {
                            $item->RetName = Crypt::decryptString($item->RetName);
                        } catch (\Exception $e) {
                            // decrypt болохгүй бол шууд утгыг нь үлдээнэ
                            $item->RetName = $item->RetName;
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
