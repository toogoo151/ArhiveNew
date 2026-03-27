<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ErhzuiModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class ErhzuiController extends Controller
{
    //
    private function userFilesDir(): string
    {
        return 'erhzui_files/' . Auth::id();
    }

    private function extractStoredPath($fileField): ?string
    {
        if (empty($fileField)) {
            return null;
        }

        // Expected format: json_encode(['path' => 'erhzui_files/<user_id>/<name>', 'name' => '<original>'])
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

    public function CreateErhzui(Request $req)
    {
        $req->validate([
            'erhzui_turul' => 'required',
            'erhzui_akt_ner' => 'required',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240'
        ]);

        try {

            $filePath = null;

            if ($req->hasFile('file')) {
                $originalName = $req->file('file')->getClientOriginalName();
                $safeName =
                    time() . '_' . Auth::id() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\.\-_]/', '_', $originalName);
                $storedPath = $req->file('file')->storeAs($this->userFilesDir(), $safeName, 'public');
                $filePath = json_encode(['path' => $storedPath, 'name' => $originalName]);
            }

            $insertErhzui = new ErhzuiModel();
            $insertErhzui->erhzui_turul = $req->erhzui_turul;
            $insertErhzui->erhzui_akt_ner = $req->erhzui_akt_ner;
            $insertErhzui->tailbar = $req->tailbar;
            $insertErhzui->file = $filePath;
            $insertErhzui->user_id = Auth::id();
            $insertErhzui->save();

            return response([
                "status" => "success",
                "msg" => "Амжилттай хадгаллаа."
            ], 200);
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Алдаа гарлаа."
            ], 500);
        }
    }
    public function GetErhzui()
    {
        try {
            $erhzui = ErhzuiModel::where("user_id", Auth::id())->orderByDesc("id")->get();
            return response(
                array(
                    "status" => "success",
                    "data" => $erhzui
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
    public function UpdateErhzui(Request $req)
    {
        $req->validate([
            'id' => 'required|integer',
            'erhzui_turul' => 'required',
            'erhzui_akt_ner' => 'required',
            'file' => 'nullable|file'
        ]);
        try {

            $updateErhzui = ErhzuiModel::where('id', $req->id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$updateErhzui) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            $oldStoredPath = $updateErhzui ? $this->extractStoredPath($updateErhzui->file) : null;
            $newStoredPath = null;

            if ($req->hasFile('file')) {
                $originalName = $req->file('file')->getClientOriginalName();
                $safeName =
                    time() . '_' . Auth::id() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\.\-_]/', '_', $originalName);
                $storedPath = $req->file('file')->storeAs($this->userFilesDir(), $safeName, 'public');
                $newStoredPath = $storedPath;
                $updateErhzui->file = json_encode(['path' => $storedPath, 'name' => $originalName]);
            }

            $updateErhzui->erhzui_turul = $req->erhzui_turul;
            $updateErhzui->erhzui_akt_ner = $req->erhzui_akt_ner;
            $updateErhzui->tailbar = $req->tailbar;
            $updateErhzui->save();

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
    public function DeleteErhzui(Request $req)
    {
        try {
            $delete = ErhzuiModel::where('id', $req->id)
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
