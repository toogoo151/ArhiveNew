<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HuseltModel extends Model
{
    use HasFactory;
    protected $table = 'db_huselt_lavlagaa';
    public $timestamps = false;

    public function huseltTurul()
    {
        return $this->belongsTo(HuseltTurul::class, 'huselt_turul_id');
    }
}
