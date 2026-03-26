<?php

namespace App\Imports;

use App\Models\Dansburtgel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;
use App\Models\Humrug;


class DansImport implements ToModel
{
    public function model(array $row)
    {
        $deskId = $row[1] ?? null;
        $humrug = Humrug::where('desk_id', $deskId)
            ->where('userID', Auth::id())
            ->first();
        if (!$humrug) {
            return null;
        }
        return new Dansburtgel([
            'desk_id' => $row[0] ?? null,
            'humrugID' => $humrug->id,
            'dans_dugaar' => $row[2] ?? null,
            'dans_ner' => isset($row[3]) ? Crypt::encryptString($row[3]) : null,
            'humrug_niit' => $row[4] ?? null,
            'dans_niit' => $row[5] ?? null,
            'on_ehen' => $row[6] ?? null,
            'on_suul' => $row[7] ?? null,
            'hubi_dans' => isset($row[8]) ? Crypt::encryptString($row[8]) : null,
            'dans_tailbar' => isset($row[9]) ? Crypt::encryptString($row[9]) : null,
            'dans_baidal' => isset($row[10]) ? Crypt::encryptString($row[10]) : null,
            'hadgalah_hugatsaa' => isset($row[11]) ? Crypt::encryptString($row[11]) : null,
            'user_id' => Auth::id(),
        ]);
    }
}
