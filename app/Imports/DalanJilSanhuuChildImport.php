<?php

namespace App\Imports;

use App\Models\DalanJilSanhuu;
use App\Models\DalanJilSanhuuChild;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class DalanJilSanhuuChildImport implements ToModel
{

    public function model(array $row)
    {
        $deskId = $row[0] ?? null;
        $dalaJilSanhuu = DalanJilSanhuu::where('desk_id', $deskId)
            ->where('user_id', Auth::id())
            ->first();
        if (!$dalaJilSanhuu) {
            return null;
        }
        return new DalanJilSanhuuChild([
            'hnID' => $dalaJilSanhuu->id,
            'barimt_ner' => isset($row[1]) ? Crypt::encryptString($row[1]) : null,
            'barimt_ognoo' => isset($row[2]) ? date('Y-m-d', strtotime($row[2])) : null,
            'barimt_dugaar' => $row[3] ?? null,
            'irsen_dugaar' => $row[4] ?? null,
            'yabsan_dugaar' => $row[5] ?? null,
            'uild_gazar' => isset($row[6]) ? Crypt::encryptString($row[6]) : null,
            'huudas_too' => $row[7] ?? null,
            'habsralt_too' => $row[8] ?? null,
            'huudas_dugaar' => $row[9] ?? null,
            'aguulga' => isset($row[10]) ? Crypt::encryptString($row[10]) : null,
            'bichsen_ner' => isset($row[11]) ? Crypt::encryptString($row[11]) : null,
            'bichsen_ognoo' => isset($row[12]) ? date('Y-m-d', strtotime($row[12])) : null,
            'file_ner' => isset($row[13]) ? Crypt::encryptString($row[13]) : null,
            'user_id' => Auth::id(),
        ]);
    }
}
