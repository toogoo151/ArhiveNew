<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BaingaIltChild extends Model
{
    use HasFactory;
    protected $table = 'db_arhivbaingilt';
    public $timestamps = false;
}
