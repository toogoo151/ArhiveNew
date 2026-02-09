<?php

namespace App\Models;

use App\Http\Controllers\SportController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class MainHistory extends Model
{
    use HasFactory;
    protected $table = 'pko_main_history';
    public $timestamps = true;

    public function getProcessCheck($req){
    try {
        $getProcess = DB::table("pko_main_history")
        ->where("pko_main_history.missionID", "=",  $req->_missionID)
        ->where("pko_main_history.eeljID", "=",  $req->_eeljID)
        ->where("pko_main_history.pkoUserID", "=", Auth::user()->id)
        ->leftJoin("pko_documents", function($query){
        $query->on("pko_documents.pkoMainHistoryID", "=", "pko_main_history.id");
                })
        ->leftJoin("pko_doc_description", function($query){
                $query->on("pko_doc_description.pkoDocumentID", "=", "pko_documents.id");
                })
        ->leftJoin("pko_heltes_decline_description", function($query){
        $query->on("pko_heltes_decline_description.pkoMainHistoryID", "=", "pko_main_history.id");
                })
        ->leftJoin("pko_health", function($query){
         $query->on("pko_health.pkoMainHistoryID", "=", "pko_main_history.id");
        })
        ->select("pko_main_history.*", "pko_documents.id as pkoDocID","pko_doc_description.docDescription","pko_doc_description.id as pkoDocDescID" , "pko_heltes_decline_description.id as pkoHeltesDescID","pko_heltes_decline_description.heltesDescription", "pko_health.healthPdf")
        ->get();
        return $getProcess;


    } catch (\Throwable $th) {
        return $th;
        return response(
            array(
                "status" => "error",
                "msg" => "Тохиргоо татаж чадсангүй."
            ), 500
        );
    }
}


    public function getOfficerProcessCheck($req)
    {
        try {
            $getProcess = DB::table("pko_officer_main")
            ->where("pko_officer_main.missionID", "=",  $req->_missionID)
                ->where("pko_officer_main.eeljID", "=",  $req->_eeljID)
                ->where("pko_officer_main.pkoUserID", "=", Auth::user()->id)

                ->leftJoin("pko_documents", function ($query) {
                    $query->on("pko_documents.pkoMainHistoryID", "=", "pko_officer_main.id");
                })
                ->leftJoin("pko_doc_description", function ($query) {
                    $query->on("pko_doc_description.pkoDocumentID", "=", "pko_documents.id");
                })

                ->leftJoin("pko_health", function ($query) use ($req) {
                $query->where("pko_health.missionID", "=", $req->_missionID)
                        ->where("pko_health.eeljID", "=", $req->_eeljID)
                        ->on("pko_health.pkoMainHistoryID", "=", "pko_officer_main.id");
                })
                ->leftJoin("pko_officer_language", function ($query) use ($req) {
                    $query->where("pko_officer_language.missionID", "=", $req->_missionID)
                        ->where("pko_officer_language.eeljID", "=", $req->_eeljID)
                        ->on("pko_officer_language.MainTableID", "=", "pko_officer_main.id");
                })
                ->leftJoin("pko_officer_skill", function ($query) use ($req) {
                    $query->where("pko_officer_skill.missionID", "=", $req->_missionID)
                        ->where("pko_officer_skill.eeljID", "=", $req->_eeljID)
                        ->on("pko_officer_skill.MainTableID", "=", "pko_officer_main.id");
                })
                ->select("pko_officer_main.*", "pko_documents.id as pkoDocID", "pko_doc_description.docDescription", "pko_doc_description.id as pkoDocDescID",  "pko_health.healthPdf", "pko_officer_language.documentPdf", "pko_officer_skill.documentPdf")

                ->get();
            return $getProcess;
        } catch (\Throwable $th) {
            return $th;
            return response(
                array(
                    "status" => "error",
                    "msg" => "Тохиргоо татаж чадсангүй."
                ),
                500
            );
        }
    }





//  public function getProssDesc($req){
//     try {
//         $getProcess = DB::table("pko_documents")
//         ->where("missionID", "=", $req->_missionID)
//         ->where("eeljID", "=", $req->_eeljID)
//         ->where("pko_main_history.pkoUserID", "=", Auth::user()->id)
//         //    ->join("pko_documents", function($query){
//         //             $query->on("pko_documents.pkoMainHistoryID", "=", "pko_main_history.id");
//         //         })
//         // ->join()
//         ->get();
//         return $getProcess;
//         // return array(
//         //     "count"=>($getProcess),
//         //     "row"=>$getProcess,
//         // );

//     } catch (\Throwable $th) {
//         return response(
//             array(
//                 "status" => "error",
//                 "msg" => "Тохиргоо татаж чадсангүй."
//             ), 500
//         );
//     }
// }

    public function getShalgaltUguuguiIDs($req){
        $getTomilogdooguiID = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->join("pko_sport_changed", function($query){
                    $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                })
                ->select("pko_sport_changed.pkoMainHistoryID")
                ->get();
                $array = array();
                foreach ($getTomilogdooguiID as $value) {
                    array_push($array, $value->pkoMainHistoryID);
                }
            return $array;
    }

    public function getMainHistorys($req){
        try {
            $currentYear = now()->year;
        $ageCalculationSql = DB::raw("
            CASE
                WHEN SUBSTRING(all_users.rd, 3, 2) <= 99 AND SUBSTRING(all_users.rd, 3, 2) >= 20 THEN $currentYear - (1900 + CAST(SUBSTRING(all_users.rd, 3, 2) AS UNSIGNED))
                WHEN SUBSTRING(all_users.rd, 3, 2) < 20 THEN $currentYear - (2000 + CAST(SUBSTRING(all_users.rd, 3, 2) AS UNSIGNED))
            END as age
        ");
            if(Auth::user()->user_type == "superAdmin"){
                $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                    }
                    }
                    if($req->_gender != ""){
                        $query->where("all_users.gender", "=", $req->_gender);
                    }
                })

                ->when($req->_sportScore === "notGiven", function ($query) use ($req) {
                    $query->whereNotIn("pko_main_history.id", $this->getShalgaltUguuguiIDs($req));
                })

                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->join("tb_gender", function($query){
                    $query->on("all_users.gender", "=", "tb_gender.id");
                })
                ->when($req->_sportScore === "gived", function ($query) {
                    $query->join("pko_sport_changed", function ($query) {
                        $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                    });
                })
                ->select("pko_main_history.*", "all_users.firstName","all_users.lastName","all_users.rd", $ageCalculationSql, "tb_gender.genderName", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName")
                ->orderBy("pko_main_history.sportScore", "DESC")
                ->orderBy(function ($query) {
                    $query->select("sportType4")
                          ->from("pko_sport_changed")
                          ->whereColumn("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID")
                          ->limit(1);
                }, "DESC")
                ->get();

            return $getMainHistory;
            }
            if(Auth::user()->user_type == "comandlalAdmin"){
                $myComandlalRow = new all_users();

                $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                    if($req->_sportScore == "gived"){
                        $query->where("pko_main_history.sportScore", ">", 0);
                    } else if($req->_sportScore == "notGiven"){
                        $query->where("pko_main_history.sportScore", "=", 0.00);
                    }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query) use ($myComandlalRow, $req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id")
                    ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                    if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                    }
                    if($req->_gender != ""){
                        $query->where("all_users.gender", "=", $req->_gender);
                    }

                })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->select("pko_main_history.*", "all_users.firstName", "all_users.lastName", "all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                ->orderBy("pko_main_history.sportScore", "DESC")
                ->get();
            return $getMainHistory;
            }
            if(Auth::user()->user_type == "unitAdmin"){
                $myUnitRow = new all_users();

                $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                    if($req->_sportScore == "gived"){
                        $query->where("pko_main_history.sportScore", ">", 0);
                    } else if($req->_sportScore == "notGiven"){
                        $query->where("pko_main_history.sportScore", "=", 0.00);
                    }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query) use ($myUnitRow, $req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id")
                    ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    if($req->_gender != ""){
                        $query->where("all_users.gender", "=", $req->_gender);
                    }
                })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                 ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->select("pko_main_history.*", "all_users.firstName", "all_users.lastName", "all_users.rd", "tb_ranks.shortRank",  "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                ->orderBy("pko_main_history.sportScore", "DESC")
                ->get();
            return $getMainHistory;
            }

            if(Auth::user()->user_type == "healthDepartmentAdmin"){
                if($req->_department != ""){
                    $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                // ->where("pko_main_history.isCrime", "=", 0)
                // ->where("pko_main_history.isCanceled", "=", 0)
                ->where("pko_main_history.documentsMainApprove", "=", 1)
                ->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_department)

                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                     }
                    }
                })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->leftJoin("pko_heltes_decline_description", "pko_heltes_decline_description.pkoMainHistoryID", "=", "pko_main_history.id")
                ->select("pko_main_history.*", "all_users.firstName", "all_users.lastName", "all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_heltes_decline_description.heltesPdf", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                ->orderBy("tb_comandlal.id", "ASC")
                ->orderBy("tb_unit.id", "ASC")
                ->orderBy("pko_main_history.id", "ASC")
                ->get();
            return $getMainHistory;
                } else {
                    $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                // ->where("pko_main_history.isCrime", "=", 0)
                // ->where("pko_main_history.isCanceled", "=", 0)
                ->where("pko_main_history.documentsMainApprove", "=", 1)

                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                     }
                    }
                })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->leftJoin("pko_heltes_decline_description", "pko_heltes_decline_description.pkoMainHistoryID", "=", "pko_main_history.id")
                ->select("pko_main_history.*", "all_users.firstName", "all_users.lastName", "all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_heltes_decline_description.heltesPdf", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                ->orderBy("tb_comandlal.id", "ASC")
                ->orderBy("tb_unit.id", "ASC")
                ->orderBy("pko_main_history.id", "ASC")
                ->get();
            return $getMainHistory;
                }

            }

            if(Auth::user()->user_type == "assistantAdmin"){
                if($req->_healthState != ""){
                    $getMainHistory = DB::table("pko_main_history")
                        ->where("pko_main_history.missionID", "=", $req->_missionID)
                        ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                        ->where("pko_main_history.isCrime", "=", 0)
                        ->where("pko_main_history.isCanceled", "=", 0)
                        ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)
                        ->where("pko_main_history.healthHuudas", "=", $req->_healthState)

                        ->join("pko_users", function($query){
                            $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                        })
                        ->join("all_users", function($query)use($req){
                            $query->on("pko_users.allUsersID", "=", "all_users.id");
                            if($req->_comandlalID != ""){
                                $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                                if($req->_unitID != ""){
                                $query->where("all_users.unitID", "=", $req->_unitID);
                            }
                            }
                        })
                        ->join("pko_missions", function($query){
                            $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                        })
                        ->join("pko_mission_eelj", function($query){
                            $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                        })
                        ->join("tb_comandlal", function($query){
                            $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                        })
                        ->join("tb_unit", function($query){
                            $query->on("all_users.unitID", "=", "tb_unit.id");
                        })
                        ->join("tb_ranks", function($query){
                            $query->on("all_users.rankID", "=", "tb_ranks.id");
                        })
                        ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                        ->get();
                    return $getMainHistory;
                } else {
                    $getMainHistory = DB::table("pko_main_history")
                        ->where("pko_main_history.missionID", "=", $req->_missionID)
                        ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                        ->where("pko_main_history.isCrime", "=", 0)
                        ->where("pko_main_history.isCanceled", "=", 0)
                        ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)

                        ->join("pko_users", function($query){
                            $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                        })
                        ->join("all_users", function($query)use($req){
                            $query->on("pko_users.allUsersID", "=", "all_users.id");
                            if($req->_comandlalID != ""){
                                $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                                if($req->_unitID != ""){
                                $query->where("all_users.unitID", "=", $req->_unitID);
                            }
                            }
                        })
                        ->join("pko_missions", function($query){
                            $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                        })
                        ->join("pko_mission_eelj", function($query){
                            $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                        })
                        ->join("tb_comandlal", function($query){
                            $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                        })
                        ->join("tb_unit", function($query){
                            $query->on("all_users.unitID", "=", "tb_unit.id");
                        })
                        ->join("tb_ranks", function($query){
                            $query->on("all_users.rankID", "=", "tb_ranks.id");
                        })
                        ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                        ->get();
                    return $getMainHistory;
                }
            }

            if(Auth::user()->user_type == "hospitalAdmin"){
                if($req->_healthState != ""){
                    $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)
                ->where("pko_main_history.healthApprove", "=", $req->_healthState)

                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                     }
                    }
                })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                ->get();
            return $getMainHistory;
                } else {
                    $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)

                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                     }
                    }
                })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", $ageCalculationSql)
                ->get();
            return $getMainHistory;
                }
            }

            if (Auth::user()->user_type == "sportAdmin"){
                if($req->_sportState == "all"){
                    $getMainHistory = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=", $req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->where("pko_main_history.healthApprove", "=", 1)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id");
                        if($req->_comandlalID != ""){
                            $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                            if($req->_unitID != ""){
                                $query->where("all_users.unitID", "=", $req->_unitID);
                            }
                        }
                        if($req->_genderID != ""){
                            $query->where("all_users.gender", "=", $req->_genderID);
                        }
                    })

                    ->leftJoin("pko_sport_changed", function($query)use($req){
                        $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                        // ->on('pko_sport_score.id', "=", DB::raw('(SELECT max(id) FROM `pko_sport_score` where `pkoMainHistoryID`=pko_main_history.id)'));

                    })

                    ->join("pko_missions", function($query){
                        $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                    })
                    ->join("pko_mission_eelj", function($query){
                        $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                    })
                    ->join("tb_comandlal", function($query){
                        $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                    })
                    ->join("tb_unit", function($query){
                        $query->on("all_users.unitID", "=", "tb_unit.id");
                    })
                    ->join("tb_ranks", function($query){
                        $query->on("all_users.rankID", "=", "tb_ranks.id");
                    })
                    ->join("tb_gender", function($query){
                        $query->on("all_users.gender", "=", "tb_gender.id");
                    })
                    ->join("pko_health", function($query)use($req){
                        $query->on("pko_main_history.id", "=", "pko_health.pkoMainHistoryID");
                        if($req->_healthDate != ""){
                            $query->whereDate("pko_health.created_at", "=", $req->_healthDate);
                        }
                    })
                    ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", $ageCalculationSql, "all_users.gender", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_sport_changed.averageScore as childScore", "tb_gender.genderName", "pko_missions.missionName", "pko_mission_eelj.eeljName", DB::raw("DATE(pko_health.created_at) as healthDate"))
                    // ->orderBy("pko_main_history.sportScore",function($query){
                    //     $query->on("DESC");
                    // })
                    // ->orderBy("pko_main_history.sportScore", "DESC")
                    // ->orderBy("pko_sport_score.sportScore", "DESC")
                    ->orderByRaw("DATE(pko_health.created_at) DESC, all_users.age ASC")
                    ->get();
                    return $getMainHistory;
                } else if ($req->_sportState == "gived") {
                    $getMainHistory = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=", $req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.healthApprove", "=", 1)
                    // ->where("pko_main_history.sportScore", ">", 0)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id");
                        if($req->_comandlalID != ""){
                            $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                            if($req->_unitID != ""){
                                $query->where("all_users.unitID", "=", $req->_unitID);
                            }
                        }
                        if($req->_genderID != ""){
                            $query->where("all_users.gender", "=", $req->_genderID);
                        }
                    })
                    ->join("pko_sport_changed", function($query)use($req){
                        $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                    })
                    ->join("pko_missions", function($query){
                        $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                    })
                    ->join("pko_mission_eelj", function($query){
                        $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                    })
                    ->join("tb_comandlal", function($query){
                        $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                    })
                    ->join("tb_unit", function($query){
                        $query->on("all_users.unitID", "=", "tb_unit.id");
                    })
                    ->join("tb_ranks", function($query){
                        $query->on("all_users.rankID", "=", "tb_ranks.id");
                    })
                    ->join("tb_gender", function($query){
                        $query->on("all_users.gender", "=", "tb_gender.id");
                    })
                    ->join("pko_health", function($query)use($req){
                        $query->on("pko_main_history.id", "=", "pko_health.pkoMainHistoryID");
                        if($req->_healthDate != ""){
                            $query->whereDate("pko_health.created_at", "=", $req->_healthDate);
                        }
                    })
                    ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", $ageCalculationSql, "all_users.gender", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_sport_changed.averageScore as childScore", "tb_gender.genderName", "pko_missions.missionName", "pko_mission_eelj.eeljName", DB::raw("DATE(pko_health.created_at) as healthDate"))
                    // ->orderBy("pko_main_history.sportScore", "DESC")
                    // ->orderBy("pko_sport_score.sportScore", "DESC")
                    ->orderByRaw("DATE(pko_health.created_at) DESC, all_users.age ASC")
                    ->get();
                    return $getMainHistory;
                }

                else if ($req->_sportState == "notGiven") {
                    $getMainHistory = DB::table("pko_main_history")

                    ->where("pko_main_history.missionID", "=", $req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.healthApprove", "=", 1)
                    // ->where("pko_main_history.sportScore", "=", 0.00)
                    ->whereNotIn("pko_main_history.id", $this->getShalgaltUguuguiIDs($req))
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)

                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id");
                        if($req->_comandlalID != ""){
                            $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                            if($req->_unitID != ""){
                                $query->where("all_users.unitID", "=", $req->_unitID);
                            }
                        }
                        if($req->_genderID != ""){
                            $query->where("all_users.gender", "=", $req->_genderID);
                        }
                    })
                    ->join("pko_missions", function($query){
                        $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                    })
                    ->join("pko_mission_eelj", function($query){
                        $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                    })
                    ->join("tb_comandlal", function($query){
                        $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                    })
                    ->join("tb_unit", function($query){
                        $query->on("all_users.unitID", "=", "tb_unit.id");
                    })
                    ->join("tb_ranks", function($query){
                        $query->on("all_users.rankID", "=", "tb_ranks.id");
                    })
                    ->join("tb_gender", function($query){
                        $query->on("all_users.gender", "=", "tb_gender.id");
                    })
                    ->join("pko_health", function($query)use($req){
                        $query->on("pko_main_history.id", "=", "pko_health.pkoMainHistoryID");
                        if($req->_healthDate != ""){
                            $query->whereDate("pko_health.created_at", "=", $req->_healthDate);
                        }
                    })
                    ->select("pko_main_history.*", "all_users.lastName", "all_users.firstName","all_users.rd", $ageCalculationSql, "all_users.gender", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName",   "tb_gender.genderName", "pko_missions.missionName", "pko_mission_eelj.eeljName", DB::raw("DATE(pko_health.created_at) as healthDate"))
                    // ->orderBy("pko_main_history.sportScore", "DESC")
                    // ->orderBy("pko_sport_score.sportScore", "DESC")
                    ->orderByRaw("DATE(pko_health.created_at) DESC, all_users.age ASC")
                    ->get();
                    return $getMainHistory;
                }
            }

            if(Auth::user()->user_type == "batalionAdmin"){
                $getMainHistory = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=", $req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                    if($req->_sportScore == "gived"){
                            $query->where("pko_main_history.sportScore", ">", 0);
                    } else if($req->_sportScore == "notGiven"){
                            $query->where("pko_main_history.sportScore", "=", 0.00);
                    }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                    }
                    }
                    if($req->_gender != ""){
                        $query->where("all_users.gender", "=", $req->_gender);
                    }
                })
                ->leftJoin("pko_sport_changed", function($query)use($req){
                    $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                })
                // ->leftJoin("pko_sport_score", function($query)use($req){
                //     $query->on("pko_main_history.id", "=", "pko_sport_score.pkoMainHistoryID")
                //     ->on('pko_sport_score.id', "=", DB::raw('(SELECT max(id) FROM `pko_sport_score` where `pkoMainHistoryID`=pko_main_history.id)'));

                // })
                ->join("pko_missions", function($query){
                    $query->on("pko_main_history.missionID", "=", "pko_missions.id");
                })
                ->join("pko_mission_eelj", function($query){
                    $query->on("pko_main_history.eeljID", "=", "pko_mission_eelj.id");
                })
                ->join("tb_comandlal", function($query){
                    $query->on("all_users.comandlalID", "=", "tb_comandlal.id");
                })
                ->join("tb_unit", function($query){
                    $query->on("all_users.unitID", "=", "tb_unit.id");
                })
                ->join("tb_ranks", function($query){
                    $query->on("all_users.rankID", "=", "tb_ranks.id");
                })
                ->join("tb_gender", function($query){
                    $query->on("all_users.gender", "=", "tb_gender.id");
                })
                ->select("pko_main_history.*", "all_users.firstName","all_users.lastName","all_users.rd", $ageCalculationSql, "tb_gender.genderName", "tb_ranks.shortRank", "tb_comandlal.comandlalShortName", "tb_unit.unitShortName", "pko_missions.missionName", "pko_mission_eelj.eeljName", "pko_sport_changed.averageScore as childScore")
                ->orderBy("pko_main_history.sportScore", "DESC")
                // ->orderBy("pko_sport_score.sportScore", "DESC")
                ->orderBy("pko_sport_changed.sportType4", "DESC")
                ->get();

            return $getMainHistory;
            }

        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Үндсэн мэдээлэл татаж чадсангүй."
                ), 500
            );
    }
}







    public function getTsahSum($req){
        try {
            if(Auth::user()->user_type === "superAdmin" || Auth::user()->user_type === "batalionAdmin"){
                $getMainHistory = DB::table('pko_main_history')
                ->where("pko_main_history.missionID", "=",$req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                    // if($req->_sportScore == "gived"){
                    //     $query->where("pko_main_history.sportScore", ">", 0);
                    // } else if($req->_sportScore == "notGiven"){
                    //     $query->where("pko_main_history.sportScore", "=", 0.00);
                    // }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id");
                    if($req->_comandlalID != ""){
                        $query->where("all_users.comandlalID", "=", $req->_comandlalID);
                        if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                    }
                    }
                    if($req->_gender != ""){
                        $query->where("all_users.gender", "=", $req->_gender);
                    }
                })
                ->when($req->_sportScore === "gived", function ($query) {
                    $query->join("pko_sport_changed", function ($query) {
                        $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                    });
                })
                ->when($req->_sportScore === "notGiven", function ($query) use ($req) {
                    $query->whereNotIn("pko_main_history.id", $this->getShalgaltUguuguiIDs($req));
                })
                ->select("pko_main_history.id")
                ->get();

                $getAllTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->get();

                $getMaleTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")->where("all_users.gender", "=", 11);
                        }
                    )
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->select("pko_main_history.id")
                    ->get();

                $getFemaleTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")->where("all_users.gender", "=", 22);
                        }
                    )
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->select("pko_main_history.id")
                    ->get();

                $getFlightTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->where("pko_main_history.isFlight", "=", 1)
                    ->get();

                $getDocTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.documentsMainApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->get();

                $getHeltesTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->get();

                $getHealthTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.healthApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->get();

                $getSportTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    // ->where("pko_main_history.sportScore", ">", 0)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_sport_changed", function($query)use($req){
                        $query->on("pko_main_history.id", "=", "pko_sport_changed.pkoMainHistoryID");
                    })
                    ->get();


                $row = array(
                    "sum" => count($getMainHistory),
                    "allTotal" => count($getAllTotal),
                    "maleTotal" => count($getMaleTotal),
                    "femaleTotal" => count($getFemaleTotal),
                    "flightTotal" => count($getFlightTotal),
                    "docTotal" => count($getDocTotal),
                    "heltesTotal" => count($getHeltesTotal),
                    "healthTotal" => count($getHealthTotal),
                    "sportTotal" => count($getSportTotal),
                );
                return $row;
            }

            if(Auth::user()->user_type === "comandlalAdmin"){
                $myComandlalRow = new all_users();
                $getMainHistory = DB::table('pko_main_history')
                ->where("pko_main_history.missionID", "=",$req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                    if($req->_sportScore != ""){
                            $query->where("pko_main_history.sportScore", "=", 0);
                    }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($myComandlalRow, $req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id")
                    ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                    if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                    }
                    if($req->_gender != ""){
                        $query->where("all_users.gender", "=", $req->_gender);
                    }
                })
                ->select("pko_main_history.id")
                ->get();

                $getAllTotal = DB::table("pko_main_history")
                ->where("pko_main_history.missionID", "=",$req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($myComandlalRow, $req){
                    $query->on("pko_users.allUsersID", "=", "all_users.id")
                    ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                    if($req->_unitID != ""){
                        $query->where("all_users.unitID", "=", $req->_unitID);
                    }
                })
                ->select("pko_main_history.id")
                ->get();

                $getMaleTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id)
                        ->where("all_users.gender", "=", 11);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                        }
                    )
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->select("pko_main_history.id")
                    ->get();

                $getFemaleTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id)
                        ->where("all_users.gender", "=", 22);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                        }
                    )
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->select("pko_main_history.id")
                    ->get();

                $getFlightTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->where("pko_main_history.isFlight", "=", 1)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getDocTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.documentsMainApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getHeltesTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getHealthTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.healthApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getSportTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.sportScore", ">", 0)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myComandlalRow, $req){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.comandlalID", "=", $myComandlalRow->getUserComandlal()->id);
                        if($req->_unitID != ""){
                            $query->where("all_users.unitID", "=", $req->_unitID);
                        }
                    })
                    ->select("pko_main_history.id")
                    ->get();


                $row = array(
                    "sum" => count($getMainHistory),
                    "allTotal" => count($getAllTotal),
                    "maleTotal" => count($getMaleTotal),
                    "femaleTotal" => count($getFemaleTotal),
                    "flightTotal" => count($getFlightTotal),
                    "docTotal" => count($getDocTotal),
                    "heltesTotal" => count($getHeltesTotal),
                    "healthTotal" => count($getHealthTotal),
                    "sportTotal" => count($getSportTotal),
                );
                return $row;
            }


            if(Auth::user()->user_type === "unitAdmin"){
                $myUnitRow = new all_users();
                $getMainHistory = DB::table('pko_main_history')
                ->where("pko_main_history.missionID", "=",$req->_missionID)
                ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                ->where("pko_main_history.isCrime", "=", 0)
                ->where("pko_main_history.isCanceled", "=", 0)
                ->where(function($query)use($req){
                    if($req->_documentsMainApprove != ""){
                        $query->where("pko_main_history.documentsMainApprove", "=", $req->_documentsMainApprove);
                    }
                    if($req->_eruulMendHeltesApprove != ""){
                    $query->where("pko_main_history.eruulMendHeltesApprove", "=", $req->_eruulMendHeltesApprove);
                    }
                    if($req->_healthApprove != ""){
                    $query->where("pko_main_history.healthApprove", "=", $req->_healthApprove);
                    }
                    if($req->_sportScore != ""){
                            $query->where("pko_main_history.sportScore", "=", 0);
                    }
                })
                ->join("pko_users", function($query){
                    $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                })
                ->join("all_users", function($query)use($myUnitRow){
                    $query->on("pko_users.allUsersID", "=", "all_users.id")
                    ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                })
                ->select("pko_main_history.id")
                ->get();

                $getAllTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getMaleTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id)
                        ->where("all_users.gender", "=", 11);
                        }
                    )
                    ->select("pko_main_history.id")
                    ->get();

                $getFemaleTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id)
                        ->where("all_users.gender", "=", 22);
                        }
                    )
                    ->select("pko_main_history.id")
                    ->get();

                $getFlightTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->where("pko_main_history.isFlight", "=", 1)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getDocTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.documentsMainApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getHeltesTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.eruulMendHeltesApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getHealthTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.healthApprove", "=", 1)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    })
                    ->select("pko_main_history.id")
                    ->get();

                $getSportTotal = DB::table("pko_main_history")
                    ->where("pko_main_history.missionID", "=",$req->_missionID)
                    ->where("pko_main_history.eeljID", "=", $req->_eeljID)
                    ->where("pko_main_history.sportScore", ">", 0)
                    ->where("pko_main_history.isCrime", "=", 0)
                    ->where("pko_main_history.isCanceled", "=", 0)
                    ->join("pko_users", function($query){
                        $query->on("pko_main_history.pkoUserID", "=", "pko_users.id");
                    })
                    ->join("all_users", function($query)use($myUnitRow){
                        $query->on("pko_users.allUsersID", "=", "all_users.id")
                        ->where("all_users.unitID", "=", $myUnitRow->getUserUnit()->id);
                    })
                    ->select("pko_main_history.id")
                    ->get();


                $row = array(
                    "sum" => count($getMainHistory),
                    "allTotal" => count($getAllTotal),
                    "maleTotal" => count($getMaleTotal),
                    "femaleTotal" => count($getFemaleTotal),
                    "flightTotal" => count($getFlightTotal),
                    "docTotal" => count($getDocTotal),
                    "heltesTotal" => count($getHeltesTotal),
                    "healthTotal" => count($getHealthTotal),
                    "sportTotal" => count($getSportTotal),
                );
                return $row;
            }


        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Алдаа гарлаа."
                ), 500
            );
        }
    }



}
