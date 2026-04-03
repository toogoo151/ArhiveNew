<?php

namespace App\Log;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HnNuuts extends Model
{
    protected $table = 'db_hnnuuts_log';
    protected $fillable = [

        'humrug_id',
        'dans_id',
        'hn_turul',
        'hn_dd',
        'hn_zbn',
        'hereg_burgtel',
        'harya_on',
        'nuuts_zereglel',
        'hn_garchig',
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
