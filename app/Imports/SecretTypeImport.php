<?php

namespace App\Imports;

use App\Models\SecretTypeTuslah;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class SecretTypeImport implements ToModel
{
    public function model(array $row)
    {
        return new SecretTypeTuslah([
            'Sname' => isset($row[0]) ? Crypt::encryptString($row[0]) : null,

        ]);
    }
}
