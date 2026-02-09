<?php

namespace App\Models;

use GuzzleHttp\Psr7\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Control extends Model
{
    use HasFactory;
    protected $table = 'pko_control';
    public $timestamps = false;

public function isHidePushButton($req){
    try {
        $getControl = DB::table("pko_control")
        ->where("missionID", "=", $req->_missionID)
        ->where("eeljID", "=", $req->_eeljID)
        ->first();
        if($getControl->isPush == 0){
            return false;
        }else{
            return true;
        }
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function isDocumentAddButton($req){
    try {
        $mainHistory = DB::table("pko_main_history")
        ->where("missionID", "=", $req->_missionID)
        ->where("eeljID", "=", $req->_eeljID)
        ->where("pkoUserID", "=", Auth::user()->id)
        ->count();

        if($mainHistory > 0){
            $getControl = DB::table("pko_control")
            ->where("missionID", "=", $req->_missionID)
            ->where("eeljID", "=", $req->_eeljID)
            ->first();
            if($getControl->isDocument == 0){
                return response(
                    array(
                        "msg"=>"Бичиг баримт оруулах хэсэг хаалттай байна.",
                        "isOpen"=>false
                    ), 200
                );
            }else{
                return response(
                    array(
                        "msg"=>"Бичиг баримт оруулах хэсэг нээгдсэн байна.",
                        "isOpen"=>true
                    ), 200
                );
            }
        }else{
            return response(
                array(
                    "msg"=>"Та энэ ажиллагаанд хүсэлт гаргаагүй байна.",
                    "isOpen"=>false
                ), 200
            );
        }


    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function isSportAddButton($req){
    try {
        $getControl = DB::table("pko_control")
        ->where("missionID", "=", $req->_missionID)
        ->where("eeljID", "=", $req->_eeljID)
        ->first();
        if($getControl->isSport == 0){
            return false;
        }else{
            return true;
        }
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function isRequestButton($req){
    try {
        $getControl = DB::table("pko_control")
        ->where("missionID", "=", $req->_missionID)
        ->where("eeljID", "=", $req->_eeljID)
        ->first();
        if($getControl->isRequest == 0){
            return false;
        }else{
            return true;
        }
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function isUserAddButton($req){
    try {
        $getControl = DB::table("pko_control")
        ->first();
        if($getControl->isUserAdd == 0){
            return false;
        }else{
            return true;
        }
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function makeControl($req){
    try {
        $makeControl = new Control();
        $makeControl->missionID = $req->_missionID;
        $makeControl->eeljID = $req->_eeljID;
        $makeControl->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай үүсгэлээ."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function editPush($req){
    try {
        $search = DB::table("pko_control")
        ->where("pko_control.missionID", "=", $req->_missionID)
        ->where("pko_control.eeljID", "=", $req->_eeljID)
        ->first();
        $edit = Control::find($search->id);
        $edit->isPush = $req->isPush;
        $edit->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай өөрчиллөө."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}
public function editDocAdd($req){
    try {
        $search = DB::table("pko_control")
        ->where("pko_control.missionID", "=", $req->_missionID)
        ->where("pko_control.eeljID", "=", $req->_eeljID)
        ->first();
        $edit = Control::find($search->id);
        $edit->isDocument = $req->isDocument;
        $edit->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай өөрчиллөө."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}
public function editRequest($req){
    try {
        $search = DB::table("pko_control")
        ->where("pko_control.missionID", "=", $req->_missionID)
        ->where("pko_control.eeljID", "=", $req->_eeljID)
        ->first();
        $edit = Control::find($search->id);
        $edit->isRequest = $req->isRequest;
        $edit->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай өөрчиллөө."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function editSport($req){
    try {
        $search = DB::table("pko_control")
        ->where("pko_control.missionID", "=", $req->_missionID)
        ->where("pko_control.eeljID", "=", $req->_eeljID)
        ->first();
        $edit = Control::find($search->id);
        $edit->isSport = $req->isSport;
        $edit->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай өөрчиллөө."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function editTomilogdson($req){
    try {
        $search = DB::table("pko_control")
        ->where("pko_control.missionID", "=", $req->_missionID)
        ->where("pko_control.eeljID", "=", $req->_eeljID)
        ->first();
        $edit = Control::find($search->id);
        $edit->isTomilogdson = $req->isTomilogdson;
        $edit->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай өөрчиллөө."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function editUserAdd($req){
    try {
        $search = DB::table("pko_control")
        ->first();
        $edit = Control::find($search->id);
        $edit->isUserAdd = $req->isUserAdd;
        $edit->save();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай өөрчиллөө."
            ),200
        );
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ),500
        );
    }
}

public function getControlCheck($req){
    try {
        $getControl = DB::table("pko_control")
        ->where("missionID", "=", $req->_missionID)
        ->where("eeljID", "=", $req->_eeljID)
        ->get();
        return array(
            "count"=>count($getControl),
            "row"=>$getControl,
        );

    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Тохиргоо татаж чадсангүй."
            ), 500
        );
    }
}
}
