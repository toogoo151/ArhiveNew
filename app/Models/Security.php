<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Security extends Model
{
      protected $fillable = [

        'mission', 'eelj', 'MainHistory','PDF','Approve', 'Description', 'edit' ,'successful', 'admin_id', 'admin_email', 'admin_name','adminRD','objectRD','objectmail','objectName', 'user_ip',
    ];
        protected $guarded = ['id', 'created_at', 'updated_at'];

    public $timestamps = true;
}
