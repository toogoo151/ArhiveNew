<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HuseltTurul extends Model
{
    use HasFactory;
    protected $table = 'huselt_turul';
    public $timestamps = false;

    public function huselts()
    {
        return $this->hasMany(HuseltModel::class, 'huselt_turul_id');
    }
}
