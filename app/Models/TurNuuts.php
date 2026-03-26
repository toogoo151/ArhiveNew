<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;


class TurNuuts extends Model
{
    use HasFactory;
    protected $table = 'db_arhivhnnuuts';
    public $timestamps = false;

    protected $fillable = [
        'desk_id',
        'humrug_id',
        'dans_id',
        'hn_turul',
        'hn_dd',
        'hn_zbn',
        'hereg_burgtel',
        'harya_on',
        'hn_garchig',
        'nuuts_zereglel',
        'on_ehen',
        'on_suul',
        'huudas_too',
        'habsralt_too',
        'ustgasan_temdeglel',
        'jagsaalt_zuildugaar',
        'hn_tailbar',
        'user_id',
    ];

    // protected static function booted()
    // {
    //     static::created(function (TurNuuts $turNuuts) {
    //         if (empty($turNuuts->id)) {
    //             $turNuuts->id = $turNuuts->id;
    //             $turNuuts->saveQuietly();
    //         }
    //     });
    // }

    // public function getBaingaNuuts()
    // {
    //     try {
    //         $baingaNuuts = DB::table("db_arhivhnnuuts")
    //             ->join("db_humrug", "db_humrug.humrug_dugaar", "=", "db_arhivhnnuuts.humrug_id")
    //             ->leftjoin("db_arhivdans", "db_arhivdans.dans_dugaar", "=", "db_arhivhnnuuts.dans_id")
    //             ->select("db_arhivhnnuuts.*", "db_humrug.humrug_ner", "db_arhivdans.dans_ner")
    //             ->get();
    //         return $baingaNuuts;
    //     } catch (\Throwable $th) {
    //         return response(
    //             array(
    //                 "status" => "error",
    //                 "msg" => "татаж чадсангүй."
    //             ),
    //             500
    //         );
    //     }
    // }

    public function getArchiveTurNuuts()
    {
        try {

            $ArchiveturNuuts = DB::table("db_arhivhnnuuts")
                ->select(
                    "db_arhivhnnuuts.*",

                    // humrug нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT humrug_ner
              FROM db_humrug
              WHERE db_humrug.id = db_arhivhnnuuts.humrug_id
              LIMIT 1) as humrug_ner"),

                    // dans нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT dans_ner
              FROM db_arhivdans
              WHERE db_arhivdans.id = db_arhivhnnuuts.dans_id
              LIMIT 1) as dans_ner"),

                    // db_arhivdans доторх dans_baidal утгыг нэмэх
                    "db_arhivdans.dans_baidal",

                    // db_arhivdans доторх hadgalah_hugatsaa утгыг нэмэх
                    "db_arhivdans.hadgalah_hugatsaa",
                    "jagsaaltzuildugaar.hugatsaa as hugatsaa"
                )
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivhnnuuts.dans_id")
                ->leftJoin("jagsaaltzuildugaar", function ($join) {
                    $join->on(
                        "jagsaaltzuildugaar.barimt_dd",
                        "=",
                        "db_arhivhnnuuts.jagsaalt_zuildugaar"
                    )
                        ->where("jagsaaltzuildugaar.userID", Auth::id());
                })
                ->where("db_arhivhnnuuts.user_id", Auth::id())
                ->where("hn_turul", "=", "2")
                ->whereNotNull("db_arhivhnnuuts.ustgasan_temdeglel")
                ->where("db_arhivhnnuuts.ustgasan_temdeglel", "!=", "")
                ->orderByDesc("db_arhivhnnuuts.id")
                ->get();

            foreach ($ArchiveturNuuts as $row) {
                try {
                    if ($row->hn_zbn) {
                        $row->hn_zbn = Crypt::decryptString($row->hn_zbn);
                    }

                    if ($row->hn_garchig) {
                        $row->hn_garchig = Crypt::decryptString($row->hn_garchig);
                    }

                    if ($row->nuuts_zereglel) {
                        $row->nuuts_zereglel = Crypt::decryptString($row->nuuts_zereglel);
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

            return $ArchiveturNuuts;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй.",
                "error" => $th->getMessage()
            ], 500);
        }
    }
    // {
    //     try {

    //         $ArchiveturNuuts = DB::table("db_arhivhnnuuts")
    //             ->select(
    //                 "db_arhivhnnuuts.*",

    //                 // humrug нэрийг 1 ширхэгээр авах
    //                 DB::raw("(SELECT humrug_ner
    //           FROM db_humrug
    //           WHERE db_humrug.id = db_arhivhnnuuts.humrug_id
    //           LIMIT 1) as humrug_ner"),

    //                 // dans нэрийг 1 ширхэгээр авах
    //                 DB::raw("(SELECT dans_ner
    //           FROM db_arhivdans
    //           WHERE db_arhivdans.id = db_arhivhnnuuts.dans_id
    //           LIMIT 1) as dans_ner"),

    //                 // db_arhivdans доторх dans_baidal утгыг нэмэх
    //                 "db_arhivdans.dans_baidal",

    //                 // db_arhivdans доторх hadgalah_hugatsaa утгыг нэмэх
    //                 "db_arhivdans.hadgalah_hugatsaa"
    //             )
    //             ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivhnnuuts.dans_id")
    //             ->leftJoin("jagsaaltzuildugaar", function ($join) {
    //                 $join->on(
    //                     "jagsaaltzuildugaar.barimt_dd",
    //                     "=",
    //                     "db_arhivhnnuuts.jagsaalt_zuildugaar"
    //                 )
    //                     ->where("jagsaaltzuildugaar.userID", Auth::id());
    //             })
    //             ->whereNotNull("db_arhivhnnuuts.ustgasan_temdeglel")
    //             ->where("db_arhivhnnuuts.ustgasan_temdeglel", "!=", "")
    //             ->where("db_arhivhnnuuts.user_id", Auth::id())

    //             ->orderByDesc("db_arhivhnnuuts.id")
    //             ->get();

    //         return $ArchiveturNuuts;



    //         // $ArchiveturNuuts = DB::table("db_arhivhnnuuts")
    //         //     ->join(
    //         //         "db_humrug",
    //         //         "db_humrug.humrug_dugaar",
    //         //         "=",
    //         //         "db_arhivhnnuuts.humrug_id"
    //         //     )
    //         //     ->leftJoin(
    //         //         "db_arhivdans",
    //         //         "db_arhivdans.dans_dugaar",
    //         //         "=",
    //         //         "db_arhivhnnuuts.dans_id"
    //         //     )
    //         //     ->select(
    //         //         "db_arhivhnnuuts.*",
    //         //         "db_humrug.humrug_ner",
    //         //         "db_arhivdans.dans_ner",
    //         //         "db_arhivdans.dans_baidal",
    //         //         "db_arhivdans.hadgalah_hugatsaa"
    //         //     )
    //         //     ->whereNotNull("db_arhivhnnuuts.ustgasan_temdeglel")
    //         //     ->where("db_arhivhnnuuts.ustgasan_temdeglel", "!=", "")
    //         //     ->get();

    //         // return $ArchiveturNuuts;
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "татаж чадсангүй."
    //         ], 500);
    //     }
    // }

    public function getTurNuuts()
    {
        try {

            $turNuuts = DB::table("db_arhivhnnuuts")
                ->select(
                    "db_arhivhnnuuts.*",

                    // humrug нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT humrug_ner
              FROM db_humrug
              WHERE db_humrug.id = db_arhivhnnuuts.humrug_id
              LIMIT 1) as humrug_ner"),

                    // dans нэрийг 1 ширхэгээр авах
                    DB::raw("(SELECT dans_ner
              FROM db_arhivdans
              WHERE db_arhivdans.id = db_arhivhnnuuts.dans_id
              LIMIT 1) as dans_ner"),

                    // db_arhivdans доторх dans_baidal утгыг нэмэх
                    "db_arhivdans.dans_baidal",

                    // db_arhivdans доторх hadgalah_hugatsaa утгыг нэмэх
                    "db_arhivdans.hadgalah_hugatsaa",
                    "jagsaaltzuildugaar.hugatsaa as hugatsaa"
                )
                ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivhnnuuts.dans_id")
                ->leftJoin("jagsaaltzuildugaar", function ($join) {
                    $join->on(
                        "jagsaaltzuildugaar.barimt_dd",
                        "=",
                        "db_arhivhnnuuts.jagsaalt_zuildugaar"
                    )
                        ->where("jagsaaltzuildugaar.userID", Auth::id());
                })
                ->where("db_arhivhnnuuts.user_id", Auth::id())
                ->where("hn_turul", "=", "2")
                ->where(function ($query) {
                    $query->whereNull("ustgasan_temdeglel")
                        ->orWhere("ustgasan_temdeglel", "");
                })
                ->orderByDesc("db_arhivhnnuuts.id")
                ->get();

            foreach ($turNuuts as $row) {
                try {
                    if ($row->hn_zbn) {
                        $row->hn_zbn = Crypt::decryptString($row->hn_zbn);
                    }

                    if ($row->hn_garchig) {
                        $row->hn_garchig = Crypt::decryptString($row->hn_garchig);
                    }

                    if ($row->nuuts_zereglel) {
                        $row->nuuts_zereglel = Crypt::decryptString($row->nuuts_zereglel);
                    }
                    if ($row->hn_tailbar) {
                        $row->hn_tailbar = Crypt::decryptString($row->hn_tailbar);
                    }
                    if ($row->humrug_ner) {
                        $row->humrug_ner = Crypt::decryptString($row->humrug_ner);
                    }

                    if ($row->dans_ner) {
                        $row->dans_ner = Crypt::decryptString($row->dans_ner);
                    }

                    if ($row->dans_baidal) {
                        $row->dans_baidal = Crypt::decryptString($row->dans_baidal);
                    }

                    if ($row->hadgalah_hugatsaa) {
                        $row->hadgalah_hugatsaa = Crypt::decryptString($row->hadgalah_hugatsaa);
                    }
                } catch (\Exception $e) {
                    // decrypt алдаа гарвал original утгыг үлдээнэ
                }
            }

            return $turNuuts;
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "татаж чадсангүй.",
                "error" => $th->getMessage()
            ], 500);
        }
    }
    // {
    //     try {

    //         $turNuuts = DB::table("db_arhivhnnuuts")
    //             ->select(
    //                 "db_arhivhnnuuts.*",


    //                 DB::raw("(SELECT humrug_ner
    //           FROM db_humrug
    //           WHERE db_humrug.id = db_arhivhnnuuts.humrug_id
    //           LIMIT 1) as humrug_ner"),


    //                 DB::raw("(SELECT dans_ner
    //           FROM db_arhivdans
    //           WHERE db_arhivdans.id = db_arhivhnnuuts.dans_id
    //           LIMIT 1) as dans_ner"),

    //                 "db_arhivdans.dans_baidal",

    //                 "db_arhivdans.hadgalah_hugatsaa",
    //                 "jagsaaltzuildugaar.hugatsaa as hugatsaa"
    //             )
    //             ->leftJoin("db_arhivdans", "db_arhivdans.id", "=", "db_arhivhnnuuts.dans_id")
    //             ->leftJoin("jagsaaltzuildugaar", function ($join) {
    //                 $join->on(
    //                     "jagsaaltzuildugaar.barimt_dd",
    //                     "=",
    //                     "db_arhivhnnuuts.jagsaalt_zuildugaar"
    //                 )
    //                     ->where("jagsaaltzuildugaar.userID", Auth::id());
    //             })
    //             ->where("db_arhivhnnuuts.user_id", Auth::id())
    //             ->where(function ($query) {
    //                 $query->whereNull("ustgasan_temdeglel")
    //                     ->orWhere("ustgasan_temdeglel", "");
    //             })
    //             ->orderByDesc("db_arhivhnnuuts.id")
    //             ->get();

    //         return $turNuuts;
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "татаж чадсангүй.",
    //             "error" => $th->getMessage()
    //         ], 500);
    //     }
    // }


    public function getDansburtgelByTurNuutsHumrug($humrugID)
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

                    return $hadgalah === "Түр хадгалагдах"
                        && $baidal === "Нууц";
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
    //             ->join("db_humrug", "db_humrug.id", "=", "db_arhivdans.humrugID")
    //             ->where("db_arhivdans.hadgalah_hugatsaa", "Түр хадгалагдах")
    //             ->where("db_arhivdans.dans_baidal", "Нууц")
    //             ->where("db_arhivdans.humrugID", $humrugID)
    //             ->where("db_arhivdans.user_id", Auth::id())
    //             ->select(
    //                 "db_arhivdans.id", 
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
    //                 "db_arhivdans.id", 
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
}
