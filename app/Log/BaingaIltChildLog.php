<?php

namespace App\Log;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaingaIltChildLog extends Model
{
    protected $table = 'db_child_log';


    protected $fillable = [

        'hnID',
        'barimt_ner',
        'barimt_ognoo',
        'barimt_dugaar',
        'irsen_dugaar',
        'yabsan_dugaar',
        'uild_gazar',
        'huudas_too',
        'habsralt_too',
        'huudas_dugaar',
        'aguulga',
        'bichsen_ner',
        'bichsen_ognoo',
        'file_ner',
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
