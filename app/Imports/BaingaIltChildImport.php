<?php

namespace App\Imports;

use App\Models\BaingaIlt;
use App\Models\BaingaIltChild;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Maatwebsite\Excel\Concerns\ToModel;


class BaingaIltChildImport implements ToModel
{
    protected $hnID;
    public function __construct($hnID)
    {
        $this->hnID = $hnID;
    }

    public function model(array $row)
    {
        $row = array_values($row);

        // хоосон мөр алгасах
        if (empty(array_filter($row))) {
            return null;
        }

        $isFull = count($row) > 12;

        // 🔥 1. FULL (desk_id ашиглах)
        if ($isFull) {
            $deskId = $row[0] ?? null;

            $baingaIlt = BaingaIlt::where('desk_id', $deskId)
                ->where('user_id', Auth::id())
                ->first();

            if (!$baingaIlt) {
                return null;
            }

            $hnID = $baingaIlt->id;
        }
        // 🔥 2. SHORT (parent-аас авах)
        else {
            $hnID = $this->hnID;
        }
        return new BaingaIltChild([
            'hnID' => $hnID,
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
    // {
    //     $deskId = $row[0] ?? null;
    //     $baingaIlt = BaingaIlt::where('desk_id', $deskId)
    //         ->where('user_id', Auth::id())
    //         ->first();
    //     if (!$baingaIlt) {
    //         return null;
    //     }
    //     return new BaingaIltChild([
    //         'hnID' => $baingaIlt->id,
    //         'barimt_ner' =>  isset($row[1]) ? Crypt::encryptString($row[1]) : null,
    //         'barimt_ognoo' => isset($row[2]) ? date('Y-m-d', strtotime($row[2])) : null,
    //         // 'barimt_ognoo' => $row[2] ?? null,
    //         'barimt_dugaar' => $row[3] ?? null,
    //         'irsen_dugaar' => $row[4] ?? null,
    //         'yabsan_dugaar' => $row[5] ?? null,
    //         'uild_gazar' =>  isset($row[6]) ? Crypt::encryptString($row[6]) : null,
    //         'huudas_too' => $row[7] ?? null,
    //         'habsralt_too' => $row[8] ?? null,
    //         'huudas_dugaar' => $row[9] ?? null,
    //         'aguulga' =>  isset($row[10]) ? Crypt::encryptString($row[10]) : null,
    //         'bichsen_ner' =>  isset($row[11]) ? Crypt::encryptString($row[11]) : null,
    //         'bichsen_ognoo' => isset($row[12]) ? date('Y-m-d', strtotime($row[12])) : null,
    //         // 'bichsen_ognoo' => $row[12] ?? null,
    //         'file_ner' => isset($row[13]) ? Crypt::encryptString($row[13]) : null,
    //         'user_id' => Auth::id(),
    //     ]);

    //     $row = array_values($row);


    //     if (empty(array_filter($row))) {
    //         return null;
    //     }


    //     $isFull = count($row) > 12;

    //     // (<=12 column) dotor
    //     if (!$isFull) {

    //         return new BaingaIltChild([
    //             'hnID' => $this->hnID, // 
    //             'barimt_ner' =>  isset($row[1]) ? Crypt::encryptString($row[1]) : null,
    //             'barimt_ognoo' => isset($row[2]) ? date('Y-m-d', strtotime($row[2])) : null,
    //             'barimt_dugaar' => $row[3] ?? null,
    //             'irsen_dugaar' => $row[4] ?? null,
    //             'yabsan_dugaar' => $row[5] ?? null,
    //             'uild_gazar' =>  isset($row[6]) ? Crypt::encryptString($row[6]) : null,
    //             'huudas_too' => $row[7] ?? null,
    //             'habsralt_too' => $row[8] ?? null,
    //             'huudas_dugaar' => $row[9] ?? null,
    //             'aguulga' =>  isset($row[10]) ? Crypt::encryptString($row[10]) : null,
    //             'bichsen_ner' =>  isset($row[11]) ? Crypt::encryptString($row[11]) : null,
    //             'bichsen_ognoo' => isset($row[12]) ? date('Y-m-d', strtotime($row[12])) : null,
    //             // 'bichsen_ognoo' => $row[12] ?? null,
    //             'file_ner' => isset($row[13]) ? Crypt::encryptString($row[13]) : null,
    //             'user_id' => Auth::id(),
    //         ]);
    //     }
    // }
}
