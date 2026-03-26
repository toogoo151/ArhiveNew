<?php

namespace App\Imports;

use App\Models\TurNuuts;
use App\Models\Dansburtgel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class TurNuutsImport implements ToModel
{
    protected $humrug_id;
    protected $dans_id;

    public function __construct($humrug_id, $dans_id)
    {
        $this->humrug_id = $humrug_id;
        $this->dans_id = $dans_id;
    }

    public function model(array $row)
    {
        $row = array_values($row);


        if (empty(array_filter($row))) {
            return null;
        }


        $isFull = count($row) > 12;

        // (<=12 column) dotor
        if (!$isFull) {

            return new TurNuuts([
                'desk_id' => null,
                'humrug_id' => $this->humrug_id,
                'dans_id' => $this->dans_id,
                'hn_turul' => 0,
                'hn_dd' => $row[0] ?? null,
                'hn_zbn' =>  isset($row[1]) ? Crypt::encryptString($row[1]) : null,
                'hereg_burgtel' => $row[2] ?? null,
                'harya_on' => $row[3] ?? null,
                'hn_garchig' =>  isset($row[4]) ? Crypt::encryptString($row[4]) : null,
                'nuuts_zereglel' =>  isset($row[5]) ? Crypt::encryptString($row[5]) : null,
                'on_ehen' => isset($row[6]) ? date('Y-m-d', strtotime($row[6])) : null,
                'on_suul' => isset($row[7]) ? date('Y-m-d', strtotime($row[7])) : null,
                'huudas_too' => $row[8] ?? null,
                'habsralt_too' => $row[9] ?? null,
                'ustgasan_temdeglel' => isset($row[10]) ? Crypt::encryptString($row[10]) : null,
                'jagsaalt_zuildugaar' => $row[11] ?? null,
                'hn_tailbar' => isset($row[12]) ? Crypt::encryptString($row[12]) : null,
                'user_id' => Auth::id(),
            ]);
        }

        $dansId = $row[2] ?? null;

        $dans = Dansburtgel::where('desk_id', $dansId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$dans) {
            return null;
        }

        return new TurNuuts([
            'desk_id' => $row[0] ?? null,
            'humrug_id' => $dans->humrugID,
            'dans_id' => $dans->id,
            'hn_turul' => $row[3] ?? null,
            'hn_dd' => $row[4] ?? null,
            'hn_zbn' =>  isset($row[5]) ? Crypt::encryptString($row[5]) : null,
            'hereg_burgtel' => $row[6] ?? null,
            'harya_on' => $row[7] ?? null,
            'hn_garchig' =>  isset($row[8]) ? Crypt::encryptString($row[8]) : null,
            'nuuts_zereglel' =>  isset($row[9]) ? Crypt::encryptString($row[9]) : null,
            'on_ehen' => isset($row[10]) ? date('Y-m-d', strtotime($row[10])) : null,
            'on_suul' => isset($row[11]) ? date('Y-m-d', strtotime($row[11])) : null,
            'huudas_too' => $row[12] ?? null,
            'habsralt_too' => $row[13] ?? null,
            'ustgasan_temdeglel' => isset($row[14]) ? Crypt::encryptString($row[14]) : null,
            'jagsaalt_zuildugaar' => $row[15] ?? null,
            'hn_tailbar' => isset($row[16]) ? Crypt::encryptString($row[16]) : null,
            'user_id' => Auth::id(),
        ]);
    }
}
