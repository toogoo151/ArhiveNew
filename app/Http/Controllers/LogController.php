<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
// use App\Models\LogNegj;




class LogController extends Controller
{
    public function getLogNegj(Request $request)
    {
        try {
            $user = Auth::user();


            $query = DB::table("db_hnilt_log")
                ->join("db_humrug", "db_humrug.id", "=", "db_hnilt_log.humrug_id")
                ->join("db_user", "db_user.id", "=", "db_hnilt_log.user_id")
                ->leftJoin("jagsaaltzuildugaar", function ($join) {
                    $join->on(
                        "jagsaaltzuildugaar.barimt_dd",
                        "=",
                        "db_hnilt_log.jagsaalt_zuildugaar"
                    )->where("jagsaaltzuildugaar.userID", Auth::id());
                })
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_hnilt_log.dans_id")


                ->where("db_hnilt_log.user_angiID", $user->angi_id)
                ->where(function ($q) use ($user) {
                    if ($user->salbar_id) {
                        $q->where("db_hnilt_log.user_salbarID", $user->salbar_id);
                    } else {
                        $q->whereNull("db_hnilt_log.user_salbarID");
                    }
                });


            if ($request->year) {
                $query->whereYear("db_hnilt_log.created_at", $request->year);
            }
            if ($request->month) {
                $query->whereMonth("db_hnilt_log.created_at", $request->month);
            }


            if ($request->user_id) {
                $query->where("db_hnilt_log.user_id", $request->user_id);
            }
            if ($request->h_type) {
                $query->where("db_hnilt_log.h_type", $request->h_type);
            }


            $sortField = $request->sortField ?? "db_hnilt_log.id";
            $sortOrder = $request->sortOrder ?? "desc";
            $query->orderBy($sortField, $sortOrder);


            $perPage = $request->perPage ?? 10;

            $data = $query->select(
                "db_hnilt_log.*",
                "db_humrug.humrug_ner",
                "db_arhivdans.dans_ner",
                "db_arhivdans.dans_baidal",
                "db_user.hereglegch_ner",
                "db_user.id as user_id",
                "db_arhivdans.hadgalah_hugatsaa",
                "jagsaaltzuildugaar.hugatsaa as hugatsaa"
            )->paginate($perPage);

            //  DECRYPT
            $data->getCollection()->transform(function ($row) {
                $safeDecrypt = function ($value) {
                    if (!$value) return $value;
                    try {
                        return Crypt::decryptString($value);
                    } catch (\Exception $e) {
                        return $value;
                    }
                };

                $row->hadgalamj_garchig = $safeDecrypt($row->hadgalamj_garchig);
                $row->hadgalamj_zbn     = $safeDecrypt($row->hadgalamj_zbn);
                $row->hn_tailbar        = $safeDecrypt($row->hn_tailbar);
                $row->humrug_ner        = $safeDecrypt($row->humrug_ner);
                $row->dans_ner          = $safeDecrypt($row->dans_ner);
                $row->dans_baidal       = $safeDecrypt($row->dans_baidal);
                $row->hadgalah_hugatsaa = $safeDecrypt($row->hadgalah_hugatsaa);
                $row->hereglegch_ner    = $safeDecrypt($row->hereglegch_ner);

                return $row;
            });

            // 

            $totalAll = DB::table("db_hnilt_log")
                ->where("user_angiID", $user->angi_id)
                ->where(function ($q) use ($user) {
                    if ($user->salbar_id) {
                        $q->where("user_salbarID", $user->salbar_id);
                    } else {
                        $q->whereNull("user_salbarID");
                    }
                })
                ->count();
            $years = DB::table("db_hnilt_log")
                ->where("user_angiID", $user->angi_id)
                ->where(function ($q) use ($user) {
                    if ($user->salbar_id) {
                        $q->where("user_salbarID", $user->salbar_id);
                    } else {
                        $q->whereNull("user_salbarID");
                    }
                })
                ->select(DB::raw("YEAR(created_at) as year"))
                ->distinct()
                ->orderBy("year", "desc")
                ->pluck("year");

            $usersQuery = DB::table("db_hnilt_log")
                ->join("db_user", "db_user.id", "=", "db_hnilt_log.user_id")
                ->where("db_hnilt_log.user_angiID", $user->angi_id)
                ->where(function ($q) use ($user) {
                    if ($user->salbar_id) {
                        $q->where("db_hnilt_log.user_salbarID", $user->salbar_id);
                    } else {
                        $q->whereNull("db_hnilt_log.user_salbarID");
                    }
                });


            // month filter user list дээр
            if ($request->month) {
                $usersQuery->whereMonth("db_hnilt_log.created_at", $request->month);
            }

            $users = $usersQuery
                ->select(
                    "db_user.id",
                    "db_user.hereglegch_ner",
                    DB::raw("count(*) as total")
                )
                ->groupBy("db_user.id", "db_user.hereglegch_ner")
                ->get()
                ->map(function ($u) {
                    try {
                        $u->hereglegch_ner = Crypt::decryptString($u->hereglegch_ner);
                    } catch (\Exception $e) {
                    }
                    return $u;
                });

            //  RESPONSE
            return response()->json([
                "data" => $data->items(),
                "total" => $data->total(), // filter хийсэн
                "totalAll" => $totalAll,   // бүх өгөгдөл
                "current_page" => $data->currentPage(),
                "users" => $users,
                "years" => $years,

            ]);
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Татаж чадсангүй.",
                "error" => $th->getMessage()
            ], 500);
        }
    }
}
