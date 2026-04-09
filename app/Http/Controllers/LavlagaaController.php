<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LavlagaaModel;
use App\Models\HuseltModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\DB;



class LavlagaaController extends Controller
{
    //
    private function userFilesDir(): string
    {
        return 'lavlagaa_files/' . Auth::id();
    }

    private function extractStoredPath($fileField): ?string
    {
        if (empty($fileField)) {
            return null;
        }

        // Expected format: json_encode(['path' => 'lavlagaa_files/<user_id>/<name>', 'name' => '<original>'])
        if (is_string($fileField)) {
            $decoded = json_decode($fileField, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && !empty($decoded['path'])) {
                return $decoded['path'];
            }

            // Fallback: sometimes DB might store plain relative path
            return $fileField;
        }
        return null;
    }

    public function CreateLavlagaa(Request $req)
    {
        $req->validate([
            'lav_dugaar' => 'required',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240'
        ]);

        // try {

        $filePath = null;

        if ($req->hasFile('file')) {
            $originalName = $req->file('file')->getClientOriginalName();
            $safeName =
                time() . '_' . Auth::id() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\.\-_]/', '_', $originalName);
            $storedPath = $req->file('file')->storeAs($this->userFilesDir(), $safeName, 'public');
            $filePath = json_encode(['path' => $storedPath, 'name' => $originalName]);
        }

        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
        $huselt = HuseltModel::query()
            ->where('burtgel_dugaar', $req->lav_dugaar)
            ->whereIn('user_id', $sharedUserIds)
            ->first();
        if (!$huselt) {
            return response([
                'status' => 'error',
                'msg' => 'Лавлагаа нь хүсэлтийн бүртгэлийн дугаартай таарах ёстой.',
            ], 422);
        }

        $insertLavlagaa = new LavlagaaModel();
        $insertLavlagaa->lav_dugaar = $huselt->burtgel_dugaar;
        $insertLavlagaa->lav_date = $req->lav_date;
        $insertLavlagaa->humrug_id = $req->humrug_id;
        $insertLavlagaa->dans_id = $req->dans_id;
        $insertLavlagaa->hadgalamj_id = $req->hadgalamj_id;
        $insertLavlagaa->aguulga = $req->aguulga;
        $insertLavlagaa->too_hemjee = $req->too_hemjee;
        $insertLavlagaa->file = $filePath;
        $insertLavlagaa->awsan_date = $req->awsan_date;
        $insertLavlagaa->awsan_helber = $req->awsan_helber;
        $insertLavlagaa->customer_info = $req->customer_info;
        $insertLavlagaa->user_id = Auth::id();
        $insertLavlagaa->save();

        return response([
            "status" => "success",
            "msg" => "Амжилттай хадгаллаа."
        ], 200);
        // } catch (\Throwable $th) {
        //     return response([
        //         "status" => "error",
        //         "msg" => "Алдаа гарлаа."
        //     ], 500);
        // }
    }

    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }

    public function GetLavlagaa()
    {
        // try {
        $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
        $lavlagaa = DB::table("db_lavlagaa")
            ->whereIn("db_lavlagaa.user_id", $sharedUserIds)
            ->orderBy("id")
            ->get();
        return response(
            array(
                "status" => "success",
                "data" => $lavlagaa
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
    public function UpdateLavlagaa(Request $req)
    {
        $req->validate([
            'id' => 'required|integer',
            'lav_dugaar' => 'required',
            'file' => 'nullable|file'
        ]);
        try {

            $updateLavlagaa = LavlagaaModel::where('id', $req->id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$updateLavlagaa) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            $oldStoredPath = $updateLavlagaa ? $this->extractStoredPath($updateLavlagaa->file) : null;
            $newStoredPath = null;

            if ($req->hasFile('file')) {
                $originalName = $req->file('file')->getClientOriginalName();
                $safeName =
                    time() . '_' . Auth::id() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\.\-_]/', '_', $originalName);
                $storedPath = $req->file('file')->storeAs($this->userFilesDir(), $safeName, 'public');
                $newStoredPath = $storedPath;
                $updateLavlagaa->file = json_encode(['path' => $storedPath, 'name' => $originalName]);
            }

            $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
            $huselt = HuseltModel::query()
                ->where('burtgel_dugaar', $req->lav_dugaar)
                ->whereIn('user_id', $sharedUserIds)
                ->first();
            if (!$huselt) {
                return response([
                    'status' => 'error',
                    'msg' => 'Лавлагаа нь хүсэлтийн бүртгэлийн дугаартай таарах ёстой.',
                ], 422);
            }

            $updateLavlagaa->lav_dugaar = $huselt->burtgel_dugaar;
            $updateLavlagaa->lav_date = $req->lav_date;
            $updateLavlagaa->humrug_id = $req->humrug_id;
            $updateLavlagaa->dans_id = $req->dans_id;
            $updateLavlagaa->hadgalamj_id = $req->hadgalamj_id;
            $updateLavlagaa->aguulga = $req->aguulga;
            $updateLavlagaa->too_hemjee = $req->too_hemjee;
            $updateLavlagaa->awsan_date = $req->awsan_date;
            $updateLavlagaa->awsan_helber = $req->awsan_helber;
            $updateLavlagaa->customer_info = $req->customer_info;
            $updateLavlagaa->user_id = Auth::id();
            $updateLavlagaa->save();

            // If user uploaded a replacement file, remove the old one from storage.
            if ($req->hasFile('file') && $oldStoredPath && $newStoredPath && $oldStoredPath !== $newStoredPath) {
                Storage::disk('public')->delete($oldStoredPath);
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
    public function DeleteLavlagaa(Request $req)
    {
        try {
            $delete = LavlagaaModel::where('id', $req->id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            // Delete stored file from disk as well.
            $storedPath = $this->extractStoredPath($delete->file);
            if ($storedPath) {
                Storage::disk('public')->delete($storedPath);
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
