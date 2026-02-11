<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;




class StatisticController extends Controller
{
    private function userId()
    {
        // All statistic endpoints should be user-scoped (auth middleware required)
        return Auth::id();
    }



    public function ClassCount(Request $req)
    {
        $angiCount = DB::table("db_angi")->count();
        return $angiCount;
    }
    public function UserCount(Request $req)
    {
        $userCount = DB::table("db_user")->count();
        return $userCount;
    }
    public function HutheregCount(Request $req)
    {
        $HutheregCount = DB::table("db_huthereg")
            ->where("userID", $this->userId())
            ->count();
        return $HutheregCount;
    }
    // GANBAT NEMSEN START
    public function BaingaILtCount(Request $req)
    {
        $BaingIltCount = DB::table("db_arhivbaingahad")
            ->where("user_id", $this->userId())
            ->where("hadgalamj_turul", 0)
            ->count();
        return $BaingIltCount;
    }
    public function BaingaNuutsCount(Request $req)
    {
        $BaingaNuutsCount = DB::table("db_arhivhnnuuts")
            ->where("user_id", $this->userId())
            ->where("hn_turul", 0)
            ->count();
        return $BaingaNuutsCount;
    }

    public function TurIltCount(Request $req)
    {
        $TurIltCount = DB::table("db_arhivbaingahad")
            ->where("user_id", $this->userId())
            ->where("hadgalamj_turul", 2)
            ->count();
        return $TurIltCount;
    }

    public function TurNuutsCount(Request $req)
    {
        $TurNuutsCount = DB::table("db_arhivhnnuuts")
            ->where("user_id", $this->userId())
            ->where("hn_turul", 2)
            ->count();
        return $TurNuutsCount;
    }

    public function JagsaaltCount(Request $req)
    {
        $JagsaaltCount = DB::table("jagsaaltzuildugaar")
            ->where("userID", $this->userId())
            ->count();
        return $JagsaaltCount;
    }
    public function SedevZuiCount(Request $req)
    {
        $SedevZuiCount = DB::table("arhivsedevzaagch")
            ->where("userID", $this->userId())
            ->count();
        return $SedevZuiCount;
    }
    public function NomCount(Request $req)
    {
        $NomCount = DB::table("arhivashignom")
            ->where("userID", $this->userId())
            ->count();
        return $NomCount;
    }
    public function TovchCount(Request $req)
    {
        $TovchCount = DB::table("arhivtovchlol")
            ->where("userID", $this->userId())
            ->count();
        return $TovchCount;
    }
    // GANBAT NEMSEN END

    // Graphic start

    public function monthlyStat(Request $request)
    {
        $startDate = !empty($request->startDate)
            ? Carbon::createFromFormat('Y-m-d', $request->startDate)->startOfMonth()
            : Carbon::now()->subMonths(11)->startOfMonth();

        $endDate = !empty($request->endDate)
            ? Carbon::createFromFormat('Y-m-d', $request->endDate)->endOfMonth()
            : Carbon::now()->endOfMonth();

        $results = [];
        $cursor = $startDate->copy();

        while ($cursor <= $endDate) {
            $monthStart = $cursor->copy()->startOfMonth();
            $monthEnd = $cursor->copy()->endOfMonth();

            $results[] = [
                "month" => $cursor->format("Y-m"), // frontend-д ашиглагдана
                "label" => $cursor->format("Y оны m-р сар"), // chart label
                "total" => DB::table("db_huthereg")
                    ->where("user_id", $this->userId())
                    ->whereBetween("created_at", [$monthStart, $monthEnd])
                    ->count(),
            ];

            $cursor->addMonth();
        }

        return response()->json($results);
    }

    public function groupStat(Request $request)
    {
        $startDate = $request->startDate
            ? Carbon::parse($request->startDate)->startOfDay()
            : Carbon::now()->startOfMonth();

        $endDate = $request->endDate
            ? Carbon::parse($request->endDate)->endOfDay()
            : Carbon::now()->endOfDay();

        $group = $request->group ?? "month"; // week | month
        $results = [];

        if ($group === "week") {
            $cursor = $startDate->copy()->startOfWeek();
            while ($cursor <= $endDate) {
                $weekStart = $cursor->copy()->startOfWeek();
                $weekEnd = $cursor->copy()->endOfWeek();

                $results[] = [
                    "label" => $weekStart->format("m/d") . " - " . $weekEnd->format("m/d"),
                    "total" => DB::table("db_huthereg")
                        ->where("user_id", $this->userId())
                        ->whereBetween("created_at", [$weekStart, $weekEnd])
                        ->count(),
                ];

                $cursor->addWeek();
            }
        } else {
            // month
            $cursor = $startDate->copy()->startOfMonth();
            while ($cursor <= $endDate) {
                $monthStart = $cursor->copy()->startOfMonth();
                $monthEnd = $cursor->copy()->endOfMonth();

                $results[] = [
                    "label" => $cursor->format("Y оны m-р сар"),
                    "total" => DB::table("db_huthereg")
                        ->where("user_id", $this->userId())
                        ->whereBetween("created_at", [$monthStart, $monthEnd])
                        ->count(),
                ];

                $cursor->addMonth();
            }
        }

        return response()->json($results);
    }


    public function summary(Request $request)
    {
        $startDate = !empty($request->startDate)
            ? Carbon::createFromFormat('Y-m-d', $request->startDate)->startOfDay()
            : Carbon::now()->startOfYear();

        $endDate = !empty($request->endDate)
            ? Carbon::createFromFormat('Y-m-d', $request->endDate)->endOfDay()
            : Carbon::now()->endOfDay();

        return response()->json([
            "class" => DB::table("db_angi")
                ->whereBetween("created_at", [$startDate, $endDate])
                ->count(),

            "user" => DB::table("db_user")
                ->whereBetween("created_at", [$startDate, $endDate])
                ->count(),

            "huthereg" => DB::table("db_huthereg")
                ->where("user_id", $this->userId())
                ->whereBetween("created_at", [$startDate, $endDate])
                ->count(),
        ]);
    }

    /**
     * Yearly counts for Graphic: Bainga (Pie) and Tur (Donut).
     * Filters by harya_on (e.g. "year/2024", "2024") on db_arhivbaingahad and db_arhivhnnuuts.
     */
    public function graphicYearCounts(Request $request)
    {
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
            ->where('user_id', $this->userId())
            ->where('hadgalamj_turul', 0)
            ->where($haryaCondition)
            ->count();

        $baingaNuuts = DB::table('db_arhivhnnuuts')
            ->where('user_id', $this->userId())
            ->where('hn_turul', 0)
            ->where($haryaCondition)
            ->count();

        $turIlt = DB::table('db_arhivbaingahad')
            ->where('user_id', $this->userId())
            ->where('hadgalamj_turul', 2)
            ->where($haryaCondition)
            ->count();

        $turNuuts = DB::table('db_arhivhnnuuts')
            ->where('user_id', $this->userId())
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

        $baingaIlt = DB::table('db_arhivbaingahad')
            ->where('user_id', $this->userId())
            ->where('hadgalamj_turul', 0)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        $baingaNuuts = DB::table('db_arhivhnnuuts')
            ->where('user_id', $this->userId())
            ->where('hn_turul', 0)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        $turIlt = DB::table('db_arhivbaingahad')
            ->where('user_id', $this->userId())
            ->where('hadgalamj_turul', 2)
            ->whereIn('harya_on', $haryaOnValues)
            ->count();

        $turNuuts = DB::table('db_arhivhnnuuts')
            ->where('user_id', $this->userId())
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

        // Get distinct harya_on from db_arhivbaingahad
        $baingaYears = DB::table('db_arhivbaingahad')
            ->where('user_id', $this->userId())
            ->whereNotNull('harya_on')
            ->where('harya_on', '!=', '')
            ->distinct()
            ->pluck('harya_on')
            ->toArray();

        // Get distinct harya_on from db_arhivhnnuuts
        $nuutsYears = DB::table('db_arhivhnnuuts')
            ->where('user_id', $this->userId())
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
}
