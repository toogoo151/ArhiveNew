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
}
