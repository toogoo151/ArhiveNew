<?php

namespace App\Imports;

use App\Models\TurNuuts;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class TurNuutsImport implements ToModel
{
    public function model(array $row)
    {
        return new TurNuuts([
            'desk_id' => $row[0] ?? null,
            'humrug_id' => $row[1] ?? null,
            'dans_id' => $row[2] ?? null,
            'hn_turul' => $row[3] ?? null,
            'hn_dd' => $row[4] ?? null,
            'hn_zbn' =>  isset($row[5]) ? Crypt::encryptString($row[5]) : null,
            'hereg_burgtel' => $row[6] ?? null,
            'harya_on' => $row[7] ?? null,
            'hn_garchig' =>  isset($row[8]) ? Crypt::encryptString($row[8]) : null,
            'nuuts_zereglel' =>  isset($row[9]) ? Crypt::encryptString($row[9]) : null,
            'on_ehen' => $row[10] ?? null,
            'on_suul' => $row[11] ?? null,
            'huudas_too' => $row[11] ?? null,
            'habsralt_too' => $row[12] ?? null,
            'ustgasan_temdeglel' => isset($row[13]) ? Crypt::encryptString($row[13]) : null,
            'jagsaalt_zuildugaar' => $row[14] ?? null,
            'hn_tailbar' => isset($row[15]) ? Crypt::encryptString($row[15]) : null,
            'user_id' => Auth::id(),
        ]);
    }
}
