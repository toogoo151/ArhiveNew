<?php

namespace App\Imports;

use App\Models\Retention;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class RetentionImport implements ToModel
{
    public function model(array $row)
    {
        return new Retention([
            'RetName' => isset($row[0]) ? Crypt::encryptString($row[0]) : null,

        ]);
    }
}
