<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BaingaIltChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// use Redirect, Response, File;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Imports\BaingaIltChildImport;
use App\Log\BaingaIltChildLog;
use App\Models\User;





class BaingaIltChildController extends Controller
{

    public function scopeForCurrentOrg($query, $user)
    {
        $sharedUserIds = User::withSharedAccess($user)->pluck('id');
        return $query->whereIn('user_id', $sharedUserIds);
    }

    public function ChildBaingIlt(Request $req)
    {
        try {
            $sharedUserIds = User::withSharedAccess(Auth::user())->pluck('id');
            $query = BaingaIltChild::where("hnID", $req->_parentID)
                // ->where("user_id", Auth::id());
                ->whereIn("db_arhivbaingilt.user_id", $sharedUserIds);

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
            $row = BaingaIltChild::find($req->id);

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


    public function DeleteChildBaingIlt(Request $req)
    {
        try {
            $delete = BaingaIltChild::find($req->id);

            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            // 🔐 safe decrypt function
            $safeEncrypt = function ($value) {
                return $value ? Crypt::encryptString($value) : null;
            };

            // ✅ LOG (MODEL-ээс авна)
            BaingaIltChildLog::create([
                'hnID' => $delete->hnID,
                'barimt_ner' => $safeEncrypt($delete->barimt_ner),
                'uild_gazar' => $safeEncrypt($delete->uild_gazar),
                'aguulga' => $safeEncrypt($delete->aguulga),
                'bichsen_ner' => $safeEncrypt($delete->bichsen_ner),

                'barimt_ognoo' => $delete->barimt_ognoo,
                'barimt_dugaar' => $delete->barimt_dugaar,
                'irsen_dugaar' => $delete->irsen_dugaar,
                'yabsan_dugaar' => $delete->yabsan_dugaar,

                'huudas_too' => $delete->huudas_too,
                'habsralt_too' => $delete->habsralt_too,
                'huudas_dugaar' => $delete->huudas_dugaar,
                'bichsen_ognoo' => $delete->bichsen_ognoo,

                'h_type' => "1",
                'successful' => "Устгасан",

                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::id(),
                'user_ip' => $req->ip(),
            ]);

            // 📂 FILE DELETE
            if (!empty($delete->file_ner)) {

                try {
                    $decryptedFiles = Crypt::decryptString($delete->file_ner);
                } catch (\Exception $e) {
                    $decryptedFiles = $delete->file_ner; // fallback
                }

                $files = explode(';', $decryptedFiles);

                foreach ($files as $fileUrl) {

                    if (empty($fileUrl)) continue;

                    $parsedUrl = parse_url($fileUrl);

                    if (!isset($parsedUrl['path'])) continue;

                    $relativePath = str_replace('/storage/', '', $parsedUrl['path']);
                    $storagePath = 'public/' . $relativePath;

                    if (Storage::exists($storagePath)) {
                        Storage::delete($storagePath);
                    }
                }
            }

            // 🗑 DELETE
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

    public function NewChildBaingIlt(Request $req)
    {

        $userId = Auth::id();
        $userFolder = "public/doc/BaingaIlt/{$userId}";
        $fullURL = "";

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
        }


        DB::beginTransaction();

        try {

            $savedFiles = [];
            foreach ($req->data_url as $value) {
                $pdf_data = $value["fileimage"];
                $pdf_64 = substr($pdf_data, strpos($pdf_data, ',') + 1);
                $pdfContent = base64_decode($pdf_64);

                $originalName = $value["filename"];
                $setPDFPathID = uniqid() . '_' . $originalName;
                $path = $userFolder . "/" . $setPDFPathID;

                Storage::put($path, $pdfContent, 'public');
                $savedFiles[] = $path;

                $getPDFUrl = 'storage/doc/BaingaIlt/' . $userId . '/' . $setPDFPathID;
                $fullURL .= asset($getPDFUrl) . ';';
            }

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
                'h_type' => "1",
                'successful' => "Нэмсэн",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);


            $insertBainga = new BaingaIltChild();
            $insertBainga->hnID = $req->hnID;
            $insertBainga->barimt_ner = Crypt::encryptString($req->barimt_ner);
            $insertBainga->uild_gazar = Crypt::encryptString($req->uild_gazar);
            $insertBainga->aguulga = Crypt::encryptString($req->aguulga);
            $insertBainga->bichsen_ner = Crypt::encryptString($req->bichsen_ner);
            $insertBainga->file_ner = Crypt::encryptString($fullURL);

            $insertBainga->barimt_ognoo = $req->barimt_ognoo;
            $insertBainga->barimt_dugaar = $req->barimt_dugaar;
            $insertBainga->irsen_dugaar = $req->irsen_dugaar;
            $insertBainga->yabsan_dugaar = $req->yabsan_dugaar;
            $insertBainga->huudas_too = $req->huudas_too;
            $insertBainga->habsralt_too = $req->habsralt_too;
            $insertBainga->huudas_dugaar = $req->huudas_dugaar;
            $insertBainga->bichsen_ognoo = $req->bichsen_ognoo;

            $insertBainga->user_id = $userId;
            $insertBainga->save();

            DB::commit();

            return response([
                "status" => "success",
                "msg" => "Амжилттай хадгаллаа."
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();


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

    public function EditChildBaingIlt(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/BaingaIlt/{$userId}";
        $fullURL = "";

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
        }

        try {


            $edit = BaingaIltChild::find($req->id);

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

                    $url = asset('storage/doc/BaingaIlt/' . $userId . '/' . $filename);

                    $oldFiles[] = $url;
                }
            }

            /* 4️⃣ FINAL FILE LIST */
            foreach ($oldFiles as $file) {
                $fullURL .= $file . ';';
            }


            BaingaIltChildLog::create([
                'hnID' => $req->hnID,
                'barimt_ner' => Crypt::encryptString($req->barimt_ner),
                'uild_gazar' => Crypt::encryptString($req->uild_gazar),
                'aguulga' => Crypt::encryptString($req->aguulga),
                'bichsen_ner' => Crypt::encryptString($req->bichsen_ner),
                'file_ner' => Crypt::encryptString($req->file_ner),
                'barimt_ognoo' => $req->barimt_ognoo,
                'barimt_dugaar' => $req->barimt_dugaar,
                'irsen_dugaar' => $req->irsen_dugaar,
                'yabsan_dugaar' => $req->yabsan_dugaar,
                'huudas_too' => $req->huudas_too,
                'habsralt_too' => $req->habsralt_too,
                'huudas_dugaar' => $req->huudas_dugaar,
                'bichsen_ognoo' => $req->bichsen_ognoo,
                'h_type' => "1",
                'successful' => "Зассан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            /* 5️⃣ UPDATE DB */

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


    // public function EditChildBaingIlt(Request $req)
    // {
    //     $userId = Auth::id();

    //     $userFolder = "public/doc/BaingaIlt/{$userId}";
    //     $fullURL = "";

    //     if (!Storage::exists($userFolder)) {
    //         Storage::makeDirectory($userFolder);
    //     }

    //     // 🔥 Хэрвээ файл ирсэн үед л шалгана
    //     if ($req->has('data_url') && count($req->data_url) > 0) {

    //         // 1. Давхардал шалгах
    //         foreach ($req->data_url as $value) {
    //             $setPDFPathID = $value["filename"];
    //             $path = $userFolder . "/" . $setPDFPathID;

    //             if (Storage::exists($path)) {
    //                 return response([
    //                     "status" => "error",
    //                     "msg" => "Файл \"{$setPDFPathID}\" аль хэдийн хадгалагдсан байна!"
    //                 ], 422);
    //             }
    //         }

    //         // 2. Файл хадгалах
    //         foreach ($req->data_url as $value) {

    //             $pdf_data = $value["fileimage"];
    //             $pdf_64 = substr($pdf_data, strpos($pdf_data, ',') + 1);
    //             $pdfContent = base64_decode($pdf_64);

    //             $setPDFPathID = $value["filename"];
    //             $path = $userFolder . "/" . $setPDFPathID;

    //             Storage::put($path, $pdfContent, 'public');

    //             $getPDFUrl = 'storage/doc/BaingaIlt/' . $userId . '/' . $setPDFPathID;
    //             $fullURL .= asset($getPDFUrl) . ';';
    //         }
    //     }

    //     try {
    //         $edit = BaingaIltChild::find($req->id);

    //         $edit->hnID = $req->hnID;
    //         $edit->barimt_ner = $req->barimt_ner;
    //         $edit->barimt_ognoo = $req->barimt_ognoo;
    //         $edit->barimt_dugaar = $req->barimt_dugaar;
    //         $edit->irsen_dugaar = $req->irsen_dugaar;
    //         $edit->yabsan_dugaar = $req->yabsan_dugaar;
    //         $edit->uild_gazar = $req->uild_gazar;
    //         $edit->huudas_too = $req->huudas_too;
    //         $edit->habsralt_too = $req->habsralt_too;
    //         $edit->huudas_dugaar = $req->huudas_dugaar;
    //         $edit->aguulga = $req->aguulga;
    //         $edit->bichsen_ner = $req->bichsen_ner;
    //         $edit->bichsen_ognoo = $req->bichsen_ognoo;

    //         //  Хэрвээ шинэ файл ирсэн бол update хийнэ
    //         if ($fullURL != "") {
    //             $edit->file_ner = $fullURL;
    //         }
    //         //  Эсрэг тохиолдолд хуучин file_ner хэвээр үлдэнэ

    //         $edit->user_id = $userId;
    //         $edit->save();

    //         return response([
    //             "status" => "success",
    //             "msg" => "Амжилттай заслаа."
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "Алдаа гарлаа."
    //         ], 500);
    //     }
    // }

    public function importBaingaIltsChild(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);
        $hnID = $request->hnID; // 🔥

        Excel::import(new BaingaIltChildImport($hnID), $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
