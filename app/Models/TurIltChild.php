<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TurIltChild extends Model
{
    use HasFactory;
    protected $table = 'db_arhivturilt';
    public $timestamps = false;
}
