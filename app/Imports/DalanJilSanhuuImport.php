<?php

namespace App\Imports;

use App\Models\DalanJilSanhuu;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class DalanJilSanhuuImport implements ToModel
{
    public function model(array $row)
    {
        return new DalanJilSanhuu([
            'desk_id' => $row[0] ?? null,
            'humrug_id' => $row[1] ?? null,
            'dans_id' => $row[2] ?? null,
            'hadgalamj_turul' => $row[3] ?? null,
            'hadgalamj_dugaar' => $row[4] ?? null,
            'hadgalamj_zbn' =>  isset($row[5]) ? Crypt::encryptString($row[5]) : null,
            'hergiin_indeks' => $row[6] ?? null,
            'hadgalamj_garchig' =>  isset($row[7]) ? Crypt::encryptString($row[7]) : null,
            'harya_on' => $row[8] ?? null,
            'on_ehen' => $row[9] ?? null,
            'on_suul' => $row[10] ?? null,
            'huudas_too' => $row[11] ?? null,
            'habsralt_too' => $row[12] ?? null,
            'jagsaalt_zuildugaar' => $row[13] ?? null,
            'ustgasan_temdeglel' => isset($row[14]) ? Crypt::encryptString($row[14]) : null,
            'hn_tailbar' => isset($row[15]) ? Crypt::encryptString($row[15]) : null,
            'user_id' => Auth::id(),
        ]);
    }
}
