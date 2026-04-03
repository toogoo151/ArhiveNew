<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BaingaNuutsChild;
use App\Models\BaingaIltChild;
use App\Models\DalanJilHunChild;
use App\Models\DalanJilSanhuuChild;
use App\Models\TurIltChild;
use App\Models\TurNuutsChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Crypt;


class SearchController extends Controller
{
    public function getSearchBarimt(Request $req)
    {
        try {
            $perPage = $req->perPage ?? 10;


            // $buildQuery = function ($model) use ($req) {
            //     $q = $model::query()
            //         ->where("user_id", Auth::id());


            //     if ($req->filled('barimt_ner')) {
            //         $q->where("barimt_ner", "like", "%" . trim($req->barimt_ner) . "%");
            //     }

            //     if ($req->filled('uild_gazar')) {
            //         $q->where("uild_gazar", "like", "%" . trim($req->uild_gazar) . "%");
            //     }

            //     if ($req->filled('aguulga')) {
            //         $q->where("aguulga", "like", "%" . trim($req->aguulga) . "%");
            //     }
            //     if ($req->filled('bichsen_ner')) {
            //         $q->where("bichsen_ner", "like", "%" . trim($req->bichsen_ner) . "%");
            //     }

            //     if ($req->filled('barimt_dugaar')) {
            //         $q->where("barimt_dugaar", "like", "%" . trim($req->barimt_dugaar) . "%");
            //     }

            //     if ($req->filled('irsen_dugaar')) {
            //         $q->where("irsen_dugaar", "like", "%" . trim($req->irsen_dugaar) . "%");
            //     }

            //     if ($req->filled('yabsan_dugaar')) {
            //         $q->where("yabsan_dugaar", "like", "%" . trim($req->yabsan_dugaar) . "%");
            //     }


            //     return $q->select([
            //         "id",
            //         "barimt_ner",
            //         "barimt_ognoo",
            //         "barimt_dugaar",
            //         "irsen_dugaar",
            //         "yabsan_dugaar",
            //         "uild_gazar",
            //         "huudas_too",
            //         "habsralt_too",
            //         "huudas_dugaar",
            //         "aguulga",
            //         DB::raw("COALESCE(file_ner, '') as file_ner"),
            //         "bichsen_ner",
            //         "bichsen_ognoo",
            //         DB::raw("'" . class_basename($model) . "' as source")
            //     ]);
            // };

            $buildQuery = function ($model) use ($req) {

                $user = Auth::user();
                $table = (new $model)->getTable();

                $q = $model::query()
                    ->join('db_user as u', $table . '.user_id', '=', 'u.id')
                    ->where('u.angi_id', $user->angi_id)
                    ->where(function ($query) use ($user) {
                        if ($user->salbar_id === null) {
                            $query->whereNull('u.salbar_id');
                        } else {
                            $query->where('u.salbar_id', $user->salbar_id);
                        }
                    });

                //  filters хийлээ
                if ($req->filled('barimt_ner')) {
                    $q->where($table . ".barimt_ner", "like", "%" . trim($req->barimt_ner) . "%");
                }

                if ($req->filled('uild_gazar')) {
                    $q->where($table . ".uild_gazar", "like", "%" . trim($req->uild_gazar) . "%");
                }

                if ($req->filled('aguulga')) {
                    $q->where($table . ".aguulga", "like", "%" . trim($req->aguulga) . "%");
                }

                if ($req->filled('bichsen_ner')) {
                    $q->where($table . ".bichsen_ner", "like", "%" . trim($req->bichsen_ner) . "%");
                }

                if ($req->filled('barimt_dugaar')) {
                    $q->where($table . ".barimt_dugaar", "like", "%" . trim($req->barimt_dugaar) . "%");
                }

                if ($req->filled('irsen_dugaar')) {
                    $q->where($table . ".irsen_dugaar", "like", "%" . trim($req->irsen_dugaar) . "%");
                }

                if ($req->filled('yabsan_dugaar')) {
                    $q->where($table . ".yabsan_dugaar", "like", "%" . trim($req->yabsan_dugaar) . "%");
                }

                return $q->select([
                    $table . ".id",
                    $table . ".barimt_ner",
                    $table . ".barimt_ognoo",
                    $table . ".barimt_dugaar",
                    $table . ".irsen_dugaar",
                    $table . ".yabsan_dugaar",
                    $table . ".uild_gazar",
                    $table . ".huudas_too",
                    $table . ".habsralt_too",
                    $table . ".huudas_dugaar",
                    $table . ".aguulga",
                    DB::raw("COALESCE(" . $table . ".file_ner, '') as file_ner"),
                    $table . ".bichsen_ner",
                    $table . ".bichsen_ognoo",
                    DB::raw("'" . class_basename($model) . "' as source")
                ]);
            };

            $query = $buildQuery(BaingaNuutsChild::class)
                ->unionAll($buildQuery(BaingaIltChild::class))
                ->unionAll($buildQuery(DalanJilHunChild::class))
                ->unionAll($buildQuery(DalanJilSanhuuChild::class))
                ->unionAll($buildQuery(TurIltChild::class))
                ->unionAll($buildQuery(TurNuutsChild::class));

            $data = DB::query()->fromSub($query, 'all_data')
                ->orderByDesc("id")
                // ->paginate($perPage);
                ->get();

            $filtered = $data->filter(function ($item) use ($req) {

                $safeDecrypt = function ($value) {
                    try {
                        return $value ? Crypt::decryptString($value) : $value;
                    } catch (\Exception $e) {
                        return $value;
                    }
                };

                //Descrypte хийлээ
                $item->barimt_ner = $safeDecrypt($item->barimt_ner);
                $item->uild_gazar = $safeDecrypt($item->uild_gazar);
                $item->aguulga = $safeDecrypt($item->aguulga);
                $item->bichsen_ner = $safeDecrypt($item->bichsen_ner);
                $item->file_ner = $safeDecrypt($item->file_ner);

                //Хайлт хэсэг
                if ($req->filled('barimt_ner') && stripos($item->barimt_ner, $req->barimt_ner) === false) {
                    return false;
                }

                if ($req->filled('uild_gazar') && stripos($item->uild_gazar, $req->uild_gazar) === false) {
                    return false;
                }

                if ($req->filled('aguulga') && stripos($item->aguulga, $req->aguulga) === false) {
                    return false;
                }

                if ($req->filled('bichsen_ner') && stripos($item->bichsen_ner, $req->bichsen_ner) === false) {
                    return false;
                }

                return true;
            });

            $page = max($req->page ?? 1, 1);
            $perPage = $req->perPage ?? 10;

            $total = $filtered->count();

            $dataPaginated = $filtered
                ->slice(($page - 1) * $perPage, $perPage)
                ->values();



            return response()->json([
                "data" => $dataPaginated,
                "total" => $total,
                // "data" => $data->items(),
                // "total" => $data->total(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "error" => $th->getMessage()
            ], 500);
        }
    }
}
