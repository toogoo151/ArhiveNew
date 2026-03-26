<?php

namespace App\Imports;

use App\Models\BaingaIlt;
use App\Models\Dansburtgel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class BaingaIltImport implements ToModel
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

            return new BaingaIlt([
                // 'desk_id' => null,
                'humrug_id' => $this->humrug_id,
                'dans_id' => $this->dans_id,
                'hadgalamj_turul' => 0,
                'hadgalamj_dugaar' => $row[0] ?? null,
                'hadgalamj_zbn' => isset($row[1]) ? Crypt::encryptString($row[1]) : null,
                'hergiin_indeks' => $row[2] ?? null,
                'hadgalamj_garchig' => isset($row[3]) ? Crypt::encryptString($row[3]) : null,
                'harya_on' => $row[4] ?? null,
                'on_ehen' => isset($row[5]) ? date('Y-m-d', strtotime($row[5])) : null,
                'on_suul' => isset($row[6]) ? date('Y-m-d', strtotime($row[6])) : null,
                'huudas_too' => $row[7] ?? null,
                'habsralt_too' => $row[8] ?? null,
                'jagsaalt_zuildugaar' => $row[9] ?? null,
                'ustgasan_temdeglel' => isset($row[10]) ? Crypt::encryptString($row[10]) : null,
                'hn_tailbar' => isset($row[11]) ? Crypt::encryptString($row[11]) : null,
                'user_id' => Auth::id(),
            ]);
        }


        // (>12 column) buten

        $dansId = $row[2] ?? null;

        $dans = Dansburtgel::where('desk_id', $dansId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$dans) {
            return null;
        }
        return new BaingaIlt([
            'desk_id' => $row[0] ?? null,
            'humrug_id' => $dans->humrugID,
            'dans_id' => $dans->id,
            'hadgalamj_turul' => $row[3] ?? null,
            'hadgalamj_dugaar' => $row[4] ?? null,
            'hadgalamj_zbn' => isset($row[5]) ? Crypt::encryptString($row[5]) : null,
            'hergiin_indeks' => $row[6] ?? null,
            'hadgalamj_garchig' => isset($row[7]) ? Crypt::encryptString($row[7]) : null,
            'harya_on' => $row[8] ?? null,

            'on_ehen' => isset($row[9]) ? date('Y-m-d', strtotime($row[9])) : null,
            'on_suul' => isset($row[10]) ? date('Y-m-d', strtotime($row[10])) : null,

            'huudas_too' => $row[11] ?? null,
            'habsralt_too' => $row[12] ?? null,
            'jagsaalt_zuildugaar' => $row[13] ?? null,

            'ustgasan_temdeglel' => isset($row[14]) ? Crypt::encryptString($row[14]) : null,
            'hn_tailbar' => isset($row[15]) ? Crypt::encryptString($row[15]) : null,

            'user_id' => Auth::id(),
        ]);
    }
}
// {
//     public function model(array $row)
//     {
//         return new BaingaIlt([
//             'desk_id' => $row[0] ?? null,
//             'humrug_id' => $row[1] ?? null,
//             'dans_id' => $row[2] ?? null,
//             'hadgalamj_turul' => $row[3] ?? null,
//             'hadgalamj_dugaar' => $row[4] ?? null,
//             'hadgalamj_zbn' =>  isset($row[5]) ? Crypt::encryptString($row[5]) : null,
//             'hergiin_indeks' => $row[6] ?? null,
//             'hadgalamj_garchig' =>  isset($row[7]) ? Crypt::encryptString($row[7]) : null,
//             'harya_on' => $row[8] ?? null,
//             'on_ehen' => $row[9] ?? null,
//             'on_suul' => $row[10] ?? null,
//             'huudas_too' => $row[11] ?? null,
//             'habsralt_too' => $row[12] ?? null,
//             'jagsaalt_zuildugaar' => $row[13] ?? null,
//             'ustgasan_temdeglel' => isset($row[14]) ? Crypt::encryptString($row[14]) : null,
//             'hn_tailbar' => isset($row[15]) ? Crypt::encryptString($row[15]) : null,
//             'user_id' => Auth::id(),
//         ]);
//     }
// }
