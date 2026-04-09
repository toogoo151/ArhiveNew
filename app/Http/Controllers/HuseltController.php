<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HuseltModel;
use App\Models\HuseltTurul;
use App\Models\LavlagaaModel;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class HuseltController extends Controller
{
    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }

    public function CreateHuselt(Request $req)
    {
        $req->validate([
            'burtgel_dugaar' => 'required',
            'huselt_ognoo' => 'required',
            'user_burt_dugaar' => 'required',
            'user_register' => 'required',
            'user_name' => 'required',
            'ajiltan_info' => 'required',
        ]);

        // try {

        $filePath = null;

        $insertHuselt = new HuseltModel();
        $insertHuselt->burtgel_dugaar = $req->burtgel_dugaar;
        $insertHuselt->huselt_ognoo = $req->huselt_ognoo;
        $insertHuselt->user_burt_dugaar = $req->user_burt_dugaar;
        $insertHuselt->user_register = $req->user_register;
        $insertHuselt->user_name = $req->user_name;
        $insertHuselt->user_location = $req->user_location;
        $insertHuselt->user_phonenumber = $req->user_phonenumber;
        $insertHuselt->huselt_turul_id = $req->huselt_turul_id;
        $insertHuselt->huselt_aguulga = $req->huselt_aguulga;
        $insertHuselt->ajiltan_info = $req->ajiltan_info;
        $insertHuselt->user_id = Auth::id();
        $insertHuselt->save();

        return response([
            "status" => "success",
            "msg" => "Амжилттай нэмэгдлээ."
        ], 200);
        // } catch (\Throwable $th) {
        //     return response([
        //         "status" => "error",
        //         "msg" => "Алдаа гарлаа."
        //     ], 500);
        // }
    }



    public function GetHuseltTurul()
    {
        $rows = HuseltTurul::query()->orderBy('id')->get();

        return response(
            [
                'status' => 'success',
                'data' => $rows,
            ],
            200
        );
    }

    public function GetHuselt()
    {
        // try {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
        $huselt = HuseltModel::query()
            ->with('huseltTurul')
            ->whereIn('user_id', $sharedUserIds)
            ->orderBy('burtgel_dugaar')
            ->get();
        return response(
            array(
                "status" => "success",
                "data" => $huselt
            ),
            200
        );
        // } catch (\Throwable $th) {
        //     return response(
        //         array(
        //             "status" => "error",
        //             "msg" => "Алдаа гарлаа."
        //         ),
        //         500
        //     );
        // }
    }
    public function UpdateHuselt(Request $req)
    {
        $req->validate([
            'id' => 'required|integer',
            'burtgel_dugaar' => 'required',
            'huselt_ognoo' => 'required',
            'user_burt_dugaar' => 'required',
            'user_register' => 'required',
            'user_name' => 'required',
            'ajiltan_info' => 'required',
        ]);
        try {

            $updateHuselt = HuseltModel::where('id', $req->id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$updateHuselt) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            $oldBurtgelDugaar = $updateHuselt->burtgel_dugaar;

            $updateHuselt->burtgel_dugaar = $req->burtgel_dugaar;
            $updateHuselt->huselt_ognoo = $req->huselt_ognoo;
            $updateHuselt->user_burt_dugaar = $req->user_burt_dugaar;
            $updateHuselt->user_register = $req->user_register;
            $updateHuselt->user_name = $req->user_name;
            $updateHuselt->user_location = $req->user_location;
            $updateHuselt->user_phonenumber = $req->user_phonenumber;
            $updateHuselt->huselt_turul_id = $req->huselt_turul_id;
            $updateHuselt->huselt_aguulga = $req->huselt_aguulga;
            $updateHuselt->ajiltan_info = $req->ajiltan_info;
            $updateHuselt->user_id = Auth::id();
            $updateHuselt->save();

            if ($oldBurtgelDugaar !== $req->burtgel_dugaar) {
                $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
                LavlagaaModel::query()
                    ->where('lav_dugaar', $oldBurtgelDugaar)
                    ->whereIn('user_id', $sharedUserIds)
                    ->update(['lav_dugaar' => $req->burtgel_dugaar]);
            }

            return response([
                "status" => "success",
                "msg" => "Амжилттай заслаа."
            ], 200);
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ], 500);
        }
    }
    public function DeleteHuselt(Request $req)
    {
        try {
            $delete = HuseltModel::where('id', $req->id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }
            $delete->delete();
            return response(
                array(
                    "status" => "success",
                    "msg" => "Амжилттай устгалаа."
                ),
                200
            );
        } catch (\Throwable $th) {
            return response(
                array(
                    "status" => "error",
                    "msg" => "Алдаа гарлаа."
                ),
                500
            );
        }
    }
}
