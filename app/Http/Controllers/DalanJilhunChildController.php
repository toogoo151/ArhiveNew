<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DalanJilHunChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// use Redirect, Response, File;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Imports\DalanJilHunChildImport;
use App\Log\BaingaIltChildLog;
use App\Models\User;

class DalanJilhunChildController extends Controller
{

    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }

    public function ChildDalanJilhunChild(Request $req)
    {
        try {
            $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');

            $query = DalanJilHunChild::where("hnID", $req->_parentID)
                ->whereIn("db_arhivdalanjilhn.user_id", $sharedUserIds);

            // 🔹 FILTER (шаардлагатай бол нэмнэ)
            if ($req->barimt_ner) {
                $query->where("barimt_ner", "like", "%" . $req->barimt_ner . "%");
            }

            // 🔹 SORT
            $sortField = $req->sortField ?? "id";
            $sortOrder = $req->sortOrder ?? "desc";

            $query->orderBy($sortField, $sortOrder);

            // 🔹 PAGINATION
            $perPage = $req->perPage ?? 10;

            $data = $query->paginate($perPage);

            // 🔐 decrypt хийх
            $data->getCollection()->transform(function ($item) {
                $safeDecrypt = function ($value) {
                    if (!$value) return $value;
                    try {
                        return Crypt::decryptString($value);
                    } catch (\Exception $e) {
                        return $value;
                    }
                };

                $item->barimt_ner  = $safeDecrypt($item->barimt_ner);
                $item->uild_gazar  = $safeDecrypt($item->uild_gazar);
                $item->aguulga     = $safeDecrypt($item->aguulga);
                $item->bichsen_ner = $safeDecrypt($item->bichsen_ner);
                $item->file_ner    = $safeDecrypt($item->file_ner);

                return $item;
            });

            return response()->json([
                "data" => $data->items(),
                "total" => $data->total(),
                "current_page" => $data->currentPage(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => "error",
                "msg" => "Татаж чадсангүй.",
                "error" => $th->getMessage()
            ], 500);
        }
    }



    public function DeleteChildFile(Request $req)
    {
        try {
            $row = DalanJilHunChild::find($req->id);

            if (!$row) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй"
                ], 404);
            }

            $fileUrl = $req->file_url;

            // 🔑 encrypted → decrypt
            $decryptedFiles = Crypt::decryptString($row->file_ner);

            // 🔥 1. URL-ээс relative path гаргана
            $parsed = parse_url($fileUrl);
            $relativePath = ltrim($parsed['path'], '/');

            // 🔥 2. Public path
            $fullPath = public_path($relativePath);

            // 🔥 3. Файлыг устгах
            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }

            // 🔥 4. DB дээрх file list update хийх
            $files = explode(';', $decryptedFiles);
            $newFiles = [];

            foreach ($files as $f) {
                if ($f != "" && $f != $fileUrl) {
                    $newFiles[] = $f;
                }
            }

            $newFileString = implode(';', $newFiles);
            if ($newFileString != "") {
                $newFileString .= ';';
            }

            // 🔑 дахин encrypt хийж хадгална
            $row->file_ner = $newFileString ? Crypt::encryptString($newFileString) : null;

            $row->save();

            return response([
                "status" => "success",
                "msg" => "Файл амжилттай устгагдлаа"
            ], 200);
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => $th->getMessage()
            ], 500);
        }
    }



    public function DeleteDalanJilhunChild(Request $req)
    {
        try {
            $delete = DalanJilHunChild::find($req->id);

            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }
            BaingaIltChildLog::create([
                'hnID' => $req->hnID,
                'barimt_ner' => $delete->barimt_ner
                    ? Crypt::encryptString($delete->barimt_ner)
                    : null,
                'uild_gazar' => $delete->uild_gazar
                    ? Crypt::encryptString($delete->uild_gazar)
                    : null,
                'aguulga' => $delete->aguulga
                    ? Crypt::encryptString($delete->aguulga)
                    : null,
                'bichsen_ner' => $delete->bichsen_ner
                    ? Crypt::encryptString($delete->bichsen_ner)
                    : null,
                'barimt_ognoo' => $delete->barimt_ognoo,
                'barimt_dugaar' => $delete->barimt_dugaar,
                'irsen_dugaar' => $delete->irsen_dugaar,
                'yabsan_dugaar' => $delete->yabsan_dugaar,
                'huudas_too' => $delete->huudas_too,
                'habsralt_too' => $delete->habsralt_too,
                'huudas_dugaar' => $delete->huudas_dugaar,
                'bichsen_ognoo' => $delete->bichsen_ognoo,
                'h_type' => "3",
                'successful' => "Устгасан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);


            if (!empty($delete->file_ner)) {

                // 🔑 encrypted → decrypt
                $decryptedFiles = Crypt::decryptString($delete->file_ner);

                $files = explode(';', $decryptedFiles);

                foreach ($files as $fileUrl) {

                    if (empty($fileUrl))
                        continue;

                    $parsedUrl = parse_url($fileUrl);

                    if (!isset($parsedUrl['path']))
                        continue;

                    // /storage/doc/BaingaIlt/5/file.pdf
                    $relativePath = $parsedUrl['path'];

                    // storage → public
                    $relativePath = str_replace('/storage/', '', $relativePath);

                    // public/doc/BaingaIlt/5/file.pdf
                    $storagePath = 'public/' . $relativePath;

                    if (Storage::exists($storagePath)) {
                        Storage::delete($storagePath);
                    }
                }
            }

            $delete->delete();

            return response([
                "status" => "success",
                "msg" => "Амжилттай устгалаа."
            ], 200);
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => $th->getMessage()
            ], 500);
        }
    }

    public function NewDalanJilhunChild(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/DalanJilHun/{$userId}";
        $fullURL = "";

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
        }

        DB::beginTransaction();

        try {
            // 2a. Файлуудыг хадгалах (амжилттай бол URL-г цуглуулах)
            $savedFiles = []; // хадгалагдсан файлуудын path
            foreach ($req->data_url as $value) {
                $pdf_data = $value["fileimage"];
                $pdf_64 = substr($pdf_data, strpos($pdf_data, ',') + 1);
                $pdfContent = base64_decode($pdf_64);

                $originalName = $value["filename"];
                $setPDFPathID = uniqid() . '_' . $originalName;
                $path = $userFolder . "/" . $setPDFPathID;

                Storage::put($path, $pdfContent, 'public');
                $savedFiles[] = $path;

                $getPDFUrl = 'storage/doc/DalanJilHun/' . $userId . '/' . $setPDFPathID;
                $fullURL .= asset($getPDFUrl) . ';';
            }

            // 2b. DB-д хадгалах

            BaingaIltChildLog::create([
                'hnID' => $req->hnID,
                'barimt_ner' => Crypt::encryptString($req->barimt_ner),
                'uild_gazar' => Crypt::encryptString($req->uild_gazar),
                'aguulga' => Crypt::encryptString($req->aguulga),
                'bichsen_ner' => Crypt::encryptString($req->bichsen_ner),
                'file_ner' => Crypt::encryptString($fullURL),
                'barimt_ognoo' => $req->barimt_ognoo,
                'barimt_dugaar' => $req->barimt_dugaar,
                'irsen_dugaar' => $req->irsen_dugaar,
                'yabsan_dugaar' => $req->yabsan_dugaar,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'huudas_dugaar' => $req->huudas_dugaar,
                'bichsen_ognoo' => $req->bichsen_ognoo,
                'h_type' => "3",
                'successful' => "Нэмсэн",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $insertBainga = new DalanJilHunChild();
            $insertBainga->hnID = $req->hnID;
            //encrypte start
            $insertBainga->barimt_ner = Crypt::encryptString($req->barimt_ner);
            $insertBainga->uild_gazar = Crypt::encryptString($req->uild_gazar);
            $insertBainga->aguulga = Crypt::encryptString($req->aguulga);
            $insertBainga->bichsen_ner = Crypt::encryptString($req->bichsen_ner);
            $insertBainga->file_ner = Crypt::encryptString($fullURL);
            //encrypte end
            $insertBainga->barimt_ognoo = $req->barimt_ognoo;
            $insertBainga->barimt_dugaar = $req->barimt_dugaar; // integer эсвэл validation шалгах
            $insertBainga->irsen_dugaar = $req->irsen_dugaar;
            $insertBainga->yabsan_dugaar = $req->yabsan_dugaar;
            $insertBainga->huudas_too = $req->huudas_too;
            $insertBainga->habsralt_too = $req->habsralt_too;
            $insertBainga->huudas_dugaar = $req->huudas_dugaar;
            $insertBainga->bichsen_ognoo = $req->bichsen_ognoo;
            // $insertBainga->file_ner = $fullURL;
            $insertBainga->user_id = $userId;
            $insertBainga->save();

            DB::commit();

            return response([
                "status" => "success",
                "msg" => "Амжилттай хадгаллаа."
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            // 3. Алдаа гарсан тохиолдолд хадгалагдсан файлуудыг устгах
            foreach ($savedFiles as $path) {
                if (Storage::exists($path)) {
                    Storage::delete($path);
                }
            }

            return response([
                "status" => "error",
                "msg" => $th->getMessage()
            ], 500);
        }
    }


    public function EditDalanJilhunChild(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/DalanJilHun/{$userId}";
        $fullURL = "";

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
        }

        try {

            $edit = DalanJilHunChild::find($req->id);

            if (!$edit) {
                return response([
                    "status" => "error",
                    "msg" => "ID: {$req->id} -тай бичлэг олдсонгүй!"
                ], 404);
            }

            /* 1️⃣ DB дээр байгаа файлуудыг decrypt хийнэ */
            $existingDBFiles = [];

            if ($edit->file_ner) {
                $decrypted = Crypt::decryptString($edit->file_ner);
                $existingDBFiles = array_filter(explode(';', $decrypted));
            }

            /* 2️⃣ FRONTEND-ээс ирсэн хуучин файлууд */
            $oldFiles = [];

            if ($req->old_files) {
                foreach ($req->old_files as $file) {
                    $oldFiles[] = $file['url'];
                }
            }

            /* 3️⃣ ШИНЭ FILE UPLOAD */
            if ($req->data_url) {

                foreach ($req->data_url as $value) {

                    $filename = uniqid() . '_' . $value["filename"];

                    $pdf_data = $value["fileimage"];
                    $pdf_64 = substr($pdf_data, strpos($pdf_data, ',') + 1);
                    $pdfContent = base64_decode($pdf_64);

                    $path = $userFolder . "/" . $filename;

                    Storage::put($path, $pdfContent);

                    $url = asset('storage/doc/DalanJilHun/' . $userId . '/' . $filename);

                    $oldFiles[] = $url;
                }
            }

            /* 4️⃣ FINAL FILE LIST */
            foreach ($oldFiles as $file) {
                $fullURL .= $file . ';';
            }

            /* 5️⃣ UPDATE DB */

            BaingaIltChildLog::create([
                'hnID' => $req->hnID,
                'barimt_ner' => Crypt::encryptString($req->barimt_ner),
                'uild_gazar' => Crypt::encryptString($req->uild_gazar),
                'aguulga' => Crypt::encryptString($req->aguulga),
                'bichsen_ner' => Crypt::encryptString($req->bichsen_ner),
                'file_ner' => Crypt::encryptString($fullURL),
                'barimt_ognoo' => $req->barimt_ognoo,
                'barimt_dugaar' => $req->barimt_dugaar,
                'irsen_dugaar' => $req->irsen_dugaar,
                'yabsan_dugaar' => $req->yabsan_dugaar,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'huudas_dugaar' => $req->huudas_dugaar,
                'bichsen_ognoo' => $req->bichsen_ognoo,
                'h_type' => "3",
                'successful' => "Зассан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $edit->barimt_ner = Crypt::encryptString($req->barimt_ner);
            $edit->uild_gazar = Crypt::encryptString($req->uild_gazar);
            $edit->aguulga = Crypt::encryptString($req->aguulga);
            $edit->bichsen_ner = Crypt::encryptString($req->bichsen_ner);

            $edit->file_ner = Crypt::encryptString($fullURL);

            $edit->barimt_ognoo = $req->barimt_ognoo;
            $edit->barimt_dugaar = $req->barimt_dugaar;
            $edit->irsen_dugaar = $req->irsen_dugaar;
            $edit->yabsan_dugaar = $req->yabsan_dugaar;
            $edit->huudas_too = $req->huudas_too;
            $edit->habsralt_too = $req->habsralt_too;
            $edit->huudas_dugaar = $req->huudas_dugaar;
            $edit->bichsen_ognoo = $req->bichsen_ognoo;

            $edit->user_id = $userId;

            $edit->save();

            return response([
                "status" => "success",
                "msg" => "Амжилттай заслаа."
            ], 200);
        } catch (\Throwable $th) {

            return response([
                "status" => "error",
                "msg" => $th->getMessage()
            ], 500);
        }
    }


    public function ChildDalanJilhunImport(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new DalanJilHunChildImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
