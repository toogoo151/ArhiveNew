<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DalanJilHunChild extends Model
{
    use HasFactory;
    protected $table = 'db_arhivdalanjilhn';
    public $timestamps = false;

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
        'user_id',
    ];
}
