<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;

class DalanJilSanhuu extends Model
{
    use HasFactory;
    protected $table = 'db_arhivbaingahad';
    public $timestamps = false;

    protected $fillable = [
        'desk_id',
        'humrug_id',
        'dans_id',
        'hadgalamj_turul',
        'hadgalamj_dugaar',
        'hadgalamj_zbn',
        'hergiin_indeks',
        'hadgalamj_garchig',
        'harya_on',
        'on_ehen',
        'on_suul',
        'huudas_too',
        'habsralt_too',
        'jagsaalt_zuildugaar',
        'ustgasan_temdeglel',
        'hn_tailbar',
        'user_id',
    ];

    // protected static function booted()
    // {
    //     static::created(function (DalanJilSanhuu $dalanjilSanhuu) {
    //         if (empty($dalanjilSanhuu->id)) {
    //             $dalanjilSanhuu->id = $dalanjilSanhuu->id;
    //             $dalanjilSanhuu->saveQuietly();
    //         }
    //     });
    // }

    public function getDalanJilSanhuu(Request $request)
    {
        try {
            $query = DB::table("db_arhivbaingahad")
                ->where("db_arhivbaingahad.user_id", Auth::id())
                ->join("db_humrug", "db_humrug.id", "=", "db_arhivbaingahad.humrug_id")
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivbaingahad.dans_id")
                ->leftJoin("jagsaaltzuildugaar", function ($join) {
                    $join->on(
                        "jagsaaltzuildugaar.barimt_dd",
                        "=",
                        "db_arhivbaingahad.jagsaalt_zuildugaar"
                    )->where("jagsaaltzuildugaar.userID", Auth::id());
                })
                ->select(
                    "db_arhivbaingahad.*",
                    "db_humrug.humrug_ner",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa",
                    "jagsaaltzuildugaar.hugatsaa as hugatsaa"
                )
                ->where("hadgalamj_turul", "1")
                ->where(function ($query) {
                    $query->whereNull("ustgasan_temdeglel")
                        ->orWhere("ustgasan_temdeglel", "");
                });


            if ($request->humrug_id) {
                $query->where("db_arhivbaingahad.humrug_id", $request->humrug_id);
            }

            if ($request->dans_id) {
                $query->where("db_arhivbaingahad.dans_id", $request->dans_id);
            }


            $perPage = $request->perPage ?? 10;
            $data = $query->orderByDesc("db_arhivbaingahad.id")
                ->paginate($perPage);


            foreach ($data->items() as $row) {
                try {
                    if ($row->hadgalamj_garchig)
                        $row->hadgalamj_garchig = Crypt::decryptString($row->hadgalamj_garchig);

                    if ($row->hadgalamj_zbn)
                        $row->hadgalamj_zbn = Crypt::decryptString($row->hadgalamj_zbn);

                    if ($row->hn_tailbar)
                        $row->hn_tailbar = Crypt::decryptString($row->hn_tailbar);

                    if ($row->humrug_ner)
                        $row->humrug_ner = Crypt::decryptString($row->humrug_ner);

                    if ($row->dans_ner)
                        $row->dans_ner = Crypt::decryptString($row->dans_ner);

                    if ($row->dans_baidal)
                        $row->dans_baidal = Crypt::decryptString($row->dans_baidal);

                    if ($row->hadgalah_hugatsaa)
                        $row->hadgalah_hugatsaa = Crypt::decryptString($row->hadgalah_hugatsaa);
                } catch (\Exception $e) {
                }
            }

            // 🔥 EXPIRED SORT (pagination дотор)
            $sorted = collect($data->items())->sortByDesc(function ($row) {
                if (!$row->on_suul || !$row->hugatsaa) return 0;

                $years = intval($row->hugatsaa);
                if ($years >= 70) return 0;

                try {
                    $end = \Carbon\Carbon::parse($row->on_suul)->addYears($years);
                    return $end->isPast() ? 1 : 0;
                } catch (\Exception $e) {
                    return 0;
                }
            })->values();

            return response()->json([
                "data" => $sorted,
                "total" => $data->total(),
                "current_page" => $data->currentPage()
            ]);
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй.",
                "error" => $th->getMessage()
            ], 500);
        }
    }
    public function DalanJilSanhuuByHumrug($humrugID)
    {
        try {
            $dans = DB::table("db_arhivdans")
                ->join("db_humrug", "db_humrug.id", "=", "db_arhivdans.humrugID")
                ->where("db_arhivdans.humrugID", $humrugID)
                ->where("db_arhivdans.user_id", Auth::id())
                ->select(
                    "db_arhivdans.id as id",
                    "db_arhivdans.dans_dugaar",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.hadgalah_hugatsaa",
                    "db_arhivdans.dans_baidal"
                )
                ->get()
                ->map(function ($item) {
                    $item->dans_ner = $item->dans_ner ? Crypt::decryptString($item->dans_ner) : null;
                    return $item;
                });

            $filtered = $dans->filter(function ($item) {
                try {
                    $hadgalah = Crypt::decryptString($item->hadgalah_hugatsaa);
                    $baidal = Crypt::decryptString($item->dans_baidal);

                    return $hadgalah === "70 жил хадгалагдах"
                        && $baidal === "Санхүү";
                } catch (\Exception $e) {
                    return false;
                }
            })->values();

            return $filtered;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "message" => $th->getMessage(),
            ], 500);
        }
    }
    // {
    //     try {
    //         $dans = DB::table("db_arhivdans")
    //             ->where("db_arhivdans.user_id", Auth::id())
    //             ->join("db_humrug", "db_humrug.id", "=", "db_arhivdans.humrugID")
    //             ->where("db_arhivdans.hadgalah_hugatsaa", "70 жил хадгалагдах")
    //             ->where("db_arhivdans.dans_baidal", "Санхүү")
    //             ->where("db_arhivdans.humrugID", $humrugID)
    //             ->select(
    //                 "db_arhivdans.id", // 👈 ADD THIS
    //                 "db_arhivdans.id",
    //                 "db_arhivdans.humrugID",
    //                 "db_arhivdans.dans_ner",
    //                 "db_arhivdans.humrug_niit",
    //                 "db_arhivdans.dans_niit",
    //                 "db_arhivdans.on_ehen",
    //                 "db_arhivdans.on_suul",
    //                 "db_arhivdans.hubi_dans",
    //                 "db_arhivdans.dans_tailbar",
    //                 "db_arhivdans.dans_baidal",
    //                 "db_arhivdans.hadgalah_hugatsaa",
    //                 DB::raw("MAX(db_humrug.humrug_ner) as humrug_ner")
    //             )
    //             ->groupBy(
    //                 "db_arhivdans.id", // 👈 ADD THIS
    //                 "db_arhivdans.id",
    //                 "db_arhivdans.humrugID",
    //                 "db_arhivdans.dans_ner",
    //                 "db_arhivdans.humrug_niit",
    //                 "db_arhivdans.dans_niit",
    //                 "db_arhivdans.on_ehen",
    //                 "db_arhivdans.on_suul",
    //                 "db_arhivdans.hubi_dans",
    //                 "db_arhivdans.dans_tailbar",
    //                 "db_arhivdans.dans_baidal",
    //                 "db_arhivdans.hadgalah_hugatsaa",
    //             )
    //             ->get();

    //         return $dans;
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "message" => $th->getMessage(),
    //             "file" => $th->getFile(),
    //             "line" => $th->getLine(),
    //         ], 500);
    //     }
    // }

    public function getArchiveDalanJilSanhuu()
    {
        try {
            $baingaIlt = DB::table("db_arhivbaingahad")
                ->where("db_arhivbaingahad.user_id", Auth::id())
                ->join("db_humrug", "db_humrug.id", "=", "db_arhivbaingahad.humrug_id")
                ->leftJoin("jagsaaltzuildugaar", function ($join) {
                    $join->on(
                        "jagsaaltzuildugaar.barimt_dd",
                        "=",
                        "db_arhivbaingahad.jagsaalt_zuildugaar"
                    )
                        ->where("jagsaaltzuildugaar.userID", Auth::id());
                })
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivbaingahad.dans_id")
                ->select(
                    "db_arhivbaingahad.*",
                    "db_humrug.humrug_ner",
                    "db_arhivdans.dans_ner",
                    "db_arhivdans.dans_baidal",
                    "db_arhivdans.hadgalah_hugatsaa",
                    "jagsaaltzuildugaar.hugatsaa as hugatsaa"
                )
                ->where("hadgalamj_turul", "=", "1")
                ->whereNotNull("db_arhivbaingahad.ustgasan_temdeglel")
                ->where("db_arhivbaingahad.ustgasan_temdeglel", "!=", "")
                ->orderByDesc("db_arhivbaingahad.id")
                ->get();


            foreach ($baingaIlt as $row) {
                try {
                    if ($row->hadgalamj_garchig) {
                        $row->hadgalamj_garchig = Crypt::decryptString($row->hadgalamj_garchig);
                    }

                    if ($row->hadgalamj_zbn) {
                        $row->hadgalamj_zbn = Crypt::decryptString($row->hadgalamj_zbn);
                    }

                    if ($row->hn_tailbar) {
                        $row->hn_tailbar = Crypt::decryptString($row->hn_tailbar);
                    }

                    if ($row->ustgasan_temdeglel) {
                        $row->ustgasan_temdeglel = Crypt::decryptString($row->ustgasan_temdeglel);
                    }

                    // if ($row->dans_ner) {
                    //     $row->dans_ner = Crypt::decryptString($row->dans_ner);
                    // }

                    // if ($row->dans_baidal) {
                    //     $row->dans_baidal = Crypt::decryptString($row->dans_baidal);
                    // }

                    // if ($row->hadgalah_hugatsaa) {
                    //     $row->hadgalah_hugatsaa = Crypt::decryptString($row->hadgalah_hugatsaa);
                    // }
                } catch (\Exception $e) {
                    // decrypt алдаа гарвал original утгыг үлдээнэ
                }
            }

            return $baingaIlt;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Татаж чадсангүй."
            ], 500);
        }
    }
    // {
    //     try {
    //         $Archivedalanjilhun = DB::table("db_arhivbaingahad")
    //             ->join(
    //                 "db_humrug",
    //                 "db_humrug.id",
    //                 "=",
    //                 "db_arhivbaingahad.humrug_id"
    //             )
    //             ->leftJoin(
    //                 "db_arhivdans",
    //                 "db_arhivdans.id",
    //                 "=",
    //                 "db_arhivbaingahad.dans_id"
    //             )
    //             ->leftJoin("jagsaaltzuildugaar", function ($join) {
    //                 $join->on(
    //                     "jagsaaltzuildugaar.barimt_dd",
    //                     "=",
    //                     "db_arhivbaingahad.jagsaalt_zuildugaar"
    //                 )
    //                     ->where("jagsaaltzuildugaar.userID", Auth::id());
    //             })
    //             ->select(
    //                 "db_arhivbaingahad.*",
    //                 "db_humrug.humrug_ner",
    //                 "db_arhivdans.dans_ner",
    //                 "db_arhivdans.dans_baidal",
    //                 "db_arhivdans.hadgalah_hugatsaa"
    //             )
    //             ->where("db_arhivbaingahad.user_id", Auth::id())
    //             ->whereNotNull("db_arhivbaingahad.ustgasan_temdeglel")
    //             ->where("db_arhivbaingahad.ustgasan_temdeglel", "!=", "")
    //             ->where("hadgalamj_turul", "=", "1")
    //             ->get();

    //         return $Archivedalanjilhun;
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "татаж чадсангүй."
    //         ], 500);
    //     }
    // }
}
