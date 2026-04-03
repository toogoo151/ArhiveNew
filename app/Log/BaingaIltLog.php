<?php

namespace App\Log;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaingaIltLog extends Model
{
    protected $table = 'db_hnIlt_Log';
    protected $fillable = [

        'humrug_id',
        'dans_id',
        'hadgalamj_turul',
        'hadgalamj_dugaar',
        'hadgalamj_zbn',
        'hergiin_indeks',
        'hadgalamj_garchig',
        'harya_on',
        'on_ehen',
        'on_suul',
        'huudas_too',
        'habsralt_too',
        'jagsaalt_zuildugaar',
        'ustgasan_temdeglel',
        'hn_tailbar',
        'user_ip',
        'user_angiID',
        'user_salbarID',
        'user_id',
        'successful',
        'h_type',
    ];

    public $timestamps = true;
}
