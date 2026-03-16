<?php

namespace App\Imports;

use App\Models\Humrug;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class HumrugImport implements ToModel
{
    public function model(array $row)
    {
        return new Humrug([
            'desk_id' => $row[0] ?? null,
            'humrug_dugaar' => $row[1] ?? null,
            'humrug_ner' => isset($row[2]) ? Crypt::encryptString($row[2]) : null,
            'humrug_zereglel' => $row[3] ?? null,
            'anhnii_ognoo' => $row[4] ?? null,
            'humrug_uurchlult' => isset($row[5]) ? Crypt::encryptString($row[5]) : null,
            'uurchlult_ognoo' => $row[6] ?? null,
            'humrug_tailbar' => isset($row[7]) ? Crypt::encryptString($row[7]) : null,
            'userID' => Auth::id(),
        ]);
    }
}
