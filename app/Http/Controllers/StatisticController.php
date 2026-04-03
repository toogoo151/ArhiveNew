<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;





class StatisticController extends Controller
{
    // private function userId()
    // {
    //     // All statistic endpoints should be user-scoped (auth middleware required)
    //     return Auth::id();
    // }
    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }



    public function ClassCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $angiCount = DB::table("db_angi")
            ->whereIn("db_angi.user_id", $sharedUserIds)
            ->count();
        return $angiCount;
    }
    public function UserCount(Request $req)
    {
        $userCount = DB::table("db_user")->count();
        return $userCount;
    }
    public function HutheregCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $HutheregCount = DB::table("db_huthereg")
            ->whereIn("db_huthereg.userID", $sharedUserIds)
            ->count();
        return $HutheregCount;
    }
    // GANBAT NEMSEN START
    public function BaingaILtCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
        $BaingIltCount = DB::table("db_arhivbaingahad")
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where("hadgalamj_turul", 0)
            ->count();
        return $BaingIltCount;
    }
    public function BaingaNuutsCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $BaingaNuutsCount = DB::table("db_arhivhnnuuts")
            ->whereIn("db_arhivhnnuuts.user_id", $sharedUserIds)
            ->where("hn_turul", 0)
            ->count();
        return $BaingaNuutsCount;
    }

    public function TurIltCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $TurIltCount = DB::table("db_arhivbaingahad")
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)

            ->where("hadgalamj_turul", 2)
            ->count();
        return $TurIltCount;
    }

    public function TurNuutsCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $TurNuutsCount = DB::table("db_arhivhnnuuts")
            ->whereIn("db_arhivhnnuuts.user_id", $sharedUserIds)
            ->where("hn_turul", 2)
            ->count();
        return $TurNuutsCount;
    }

    public function JagsaaltCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $JagsaaltCount = DB::table("jagsaaltzuildugaar")
            ->whereIn("jagsaaltzuildugaar.userID", $sharedUserIds)
            ->count();
        return $JagsaaltCount;
    }
    public function SedevZuiCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $SedevZuiCount = DB::table("arhivsedevzaagch")
            ->whereIn("arhivsedevzaagch.userID", $sharedUserIds)
            ->count();
        return $SedevZuiCount;
    }
    public function NomCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $NomCount = DB::table("arhivashignom")
            ->whereIn("arhivashignom.userID", $sharedUserIds)
            ->count();
        return $NomCount;
    }
    public function TovchCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $TovchCount = DB::table("arhivtovchlol")
            ->whereIn("arhivtovchlol.userID", $sharedUserIds)
            ->count();
        return $TovchCount;
    }

    public function DalanJilHRCount(Request $req)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $DalanJilHRCount = DB::table("db_arhivbaingahad")
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            // ->where("dans_id", "1")
            ->count();
        return $DalanJilHRCount;
    }



    /**
     * Yearly counts for Graphic: Bainga (Pie) and Tur (Donut).
     * Filters by harya_on (e.g. "year/2024", "2024") on db_arhivbaingahad and db_arhivhnnuuts.
     */
    public function graphicYearCounts(Request $request)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $year = (int) $request->year;
        if ($year < 1900 || $year > 2100) {
            return response()->json([
                'baingaIlt' => 0,
                'baingaNuuts' => 0,
                'turIlt' => 0,
                'turNuuts' => 0,
            ]);
        }

        $haryaCondition = function ($q) use ($year) {
            $q->where('harya_on', '=', 'year/' . $year)
                ->orWhere('harya_on', '=', (string) $year);
        };

        $baingaIlt = DB::table('db_arhivbaingahad')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('hadgalamj_turul', 0)
            ->where($haryaCondition)
            ->count();

        $baingaNuuts = DB::table('db_arhivhnnuuts')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('hn_turul', 0)
            ->where($haryaCondition)
            ->count();

        $turIlt = DB::table('db_arhivbaingahad')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('hadgalamj_turul', 2)
            ->where($haryaCondition)
            ->count();

        $turNuuts = DB::table('db_arhivhnnuuts')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('hn_turul', 2)
            ->where($haryaCondition)
            ->count();

        return response()->json([
            'baingaIlt' => $baingaIlt,
            'baingaNuuts' => $baingaNuuts,
            'turIlt' => $turIlt,
            'turNuuts' => $turNuuts,
        ]);
    }

    /**
     * Year range counts for Graphic cards.
     * Accepts startYear/endYear and filters by harya_on values like "year/2024" or "2024".
     */
    public function graphicYearRangeCounts(Request $request)
    {
        $startYear = (int) $request->startYear;
        $endYear = (int) $request->endYear;

        if ($startYear < 1900 || $startYear > 2100 || $endYear < 1900 || $endYear > 2100) {
            return response()->json([
                'baingaIlt' => 0,
                'baingaNuuts' => 0,
                'turIlt' => 0,
                'turNuuts' => 0,
            ]);
        }

        if ($startYear > $endYear) {
            [$startYear, $endYear] = [$endYear, $startYear];
        }

        $years = range($startYear, $endYear);
        $haryaOnValues = [];
        foreach ($years as $y) {
            $haryaOnValues[] = 'year/' . $y;
            $haryaOnValues[] = (string) $y;
        }
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $baingaIlt = DB::table('db_arhivbaingahad')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('hadgalamj_turul', 0)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        $baingaNuuts = DB::table('db_arhivhnnuuts')
            ->whereIn("db_arhivhnnuuts.user_id", $sharedUserIds)
            ->where('hn_turul', 0)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        $turIlt = DB::table('db_arhivbaingahad')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('hadgalamj_turul', 2)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        $turNuuts = DB::table('db_arhivhnnuuts')
            ->whereIn("db_arhivhnnuuts.user_id", $sharedUserIds)
            ->where('hn_turul', 2)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        return response()->json([
            'baingaIlt' => $baingaIlt,
            'baingaNuuts' => $baingaNuuts,
            'turIlt' => $turIlt,
            'turNuuts' => $turNuuts,
        ]);
    }

    /**
     * Get available years from harya_on column (distinct years from db_arhivbaingahad and db_arhivhnnuuts).
     * Returns min, max, and all available years.
     */
    public function graphicAvailableYears(Request $request)
    {
        $years = [];
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');


        // Get distinct harya_on from db_arhivbaingahad
        $baingaYears = DB::table('db_arhivbaingahad')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->whereNotNull('harya_on')
            ->where('harya_on', '!=', '')
            ->distinct()
            ->pluck('harya_on')
            ->toArray();

        // Get distinct harya_on from db_arhivhnnuuts
        $nuutsYears = DB::table('db_arhivhnnuuts')
            ->whereIn("db_arhivhnnuuts.user_id", $sharedUserIds)
            ->whereNotNull('harya_on')
            ->where('harya_on', '!=', '')
            ->distinct()
            ->pluck('harya_on')
            ->toArray();

        // Extract year from "year/2025" or "2025" format
        $extractYear = function ($value) {
            if (preg_match('/year\/(\d{4})/', $value, $matches)) {
                return (int) $matches[1];
            }
            if (preg_match('/^(\d{4})$/', $value, $matches)) {
                return (int) $matches[1];
            }
            return null;
        };

        foreach (array_merge($baingaYears, $nuutsYears) as $haryaOn) {
            $year = $extractYear($haryaOn);
            if ($year && $year >= 1900 && $year <= 2100) {
                $years[] = $year;
            }
        }

        $years = array_unique($years);
        sort($years);

        return response()->json([
            'years' => $years,
            'minYear' => !empty($years) ? min($years) : null,
            'maxYear' => !empty($years) ? max($years) : null,
        ]);
    }

    public function graphic70YearCounts(Request $request)
    {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

        $startYear = $request->startYear ? (int) $request->startYear : null;
        $endYear = $request->endYear ? (int) $request->endYear : null;

        $q = DB::table('db_arhivbaingahad')
            ->join('db_arhivdans', 'db_arhivdans.id', '=', 'db_arhivbaingahad.dans_id')
            ->whereIn("db_arhivbaingahad.user_id", $sharedUserIds)
            ->where('db_arhivbaingahad.hadgalamj_turul', 1)
            ->select(
                'db_arhivdans.hadgalah_hugatsaa',
                'db_arhivdans.dans_baidal'
            );

        if ($startYear !== null && $endYear !== null && $startYear >= 1900 && $endYear <= 2100) {

            if ($startYear > $endYear) {
                [$startYear, $endYear] = [$endYear, $startYear];
            }

            $years = range($startYear, $endYear);
            $haryaOnValues = [];

            foreach ($years as $y) {
                $haryaOnValues[] = 'year/' . $y;
                $haryaOnValues[] = (string) $y;
            }

            $q->whereIn('db_arhivbaingahad.harya_on', $haryaOnValues);
        }

        $rows = $q->get();

        $hunCount = 0;
        $sanhuuCount = 0;

        foreach ($rows as $row) {
            try {
                // $hadgalah = trim(Crypt::decryptString($row->hadgalah_hugatsaa));
                // $baidal = trim(Crypt::decryptString($row->dans_baidal));
                $hadgalah = Crypt::decryptString($row->hadgalah_hugatsaa);
                $baidal = Crypt::decryptString($row->dans_baidal);

                if ($hadgalah === '70 жил хадгалагдах') {

                    if ($baidal === 'Хүний нөөц') {
                        $hunCount++;
                    }

                    if ($baidal === 'Санхүү') {
                        $sanhuuCount++;
                    }
                }
            } catch (\Exception $e) {
                \Log::error($e->getMessage());
            }
        }
        // return $hunCount;

        return response()->json([
            'hun' => $hunCount,
            'sanhuu' => $sanhuuCount,
        ]);
    }


    /**
     * Counts for 70 жил хадгалах: Хүний нөөц (DalanJilHun) and Санхүү (DalanJilSanhuu).
     * Both use db_arhivbaingahad (hadgalamj_turul=1) joined with db_arhivdans.
     * Filter by dans: hadgalah_hugatsaa = '70 жил хадгалагдах' and dans_baidal = 'Хүний нөөц' or 'Санхүү'.
     * Optional: startYear/endYear to filter by harya_on.
     */
    // public function graphic70YearCounts(Request $request)
    // {
    //     $startYear = $request->startYear ? (int) $request->startYear : null;
    //     $endYear = $request->endYear ? (int) $request->endYear : null;
    //     $category = $request->category; // 'hun' or 'sanhuu'

    //     $dansBaidal = $category === 'hun' ? 'Хүний нөөц' : 'Санхүү';

    //     $q = DB::table('db_arhivbaingahad')
    //         ->join('db_arhivdans', 'db_arhivdans.id', '=', 'db_arhivbaingahad.dans_id')
    //         ->where('db_arhivbaingahad.user_id', $this->userId())
    //         ->where('db_arhivbaingahad.hadgalamj_turul', 1)
    //         ->select(
    //             'db_arhivdans.hadgalah_hugatsaa',
    //             'db_arhivdans.dans_baidal'
    //         );

    //     if ($startYear !== null && $endYear !== null && $startYear >= 1900 && $endYear <= 2100) {

    //         if ($startYear > $endYear) {
    //             [$startYear, $endYear] = [$endYear, $startYear];
    //         }

    //         $years = range($startYear, $endYear);
    //         $haryaOnValues = [];

    //         foreach ($years as $y) {
    //             $haryaOnValues[] = 'year/' . $y;
    //             $haryaOnValues[] = (string) $y;
    //         }

    //         $q->whereIn('db_arhivbaingahad.harya_on', $haryaOnValues);
    //     }

    //     $rows = $q->get();

    //     $hunCount = 0;
    //     $sanhuuCount = 0;

    //     foreach ($rows as $row) {
    //         try {
    //             $hadgalah = trim(Crypt::decryptString($row->hadgalah_hugatsaa));
    //             $baidal = trim(Crypt::decryptString($row->dans_baidal));

    //             if ($hadgalah === '70 жил хадгалагдах') {

    //                 if ($baidal === 'Хүний нөөц') {
    //                     $hunCount++;
    //                 }

    //                 if ($baidal === 'Санхүү') {
    //                     $sanhuuCount++;
    //                 }
    //             }

    //         } catch (\Exception $e) {
    //             \Log::error($e->getMessage());
    //         }
    //     }
    // }
}
