<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DalanJilSanhuuChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// use Redirect, Response, File;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use App\Imports\DalanJilSanhuuChildImport;
use App\Log\BaingaIltChildLog;


class DalanJilSanhuuChildController extends Controller
{

    public function ChildDalanJilsanhuuChild(Request $req)
    {
        try {
            $query = DalanJilSanhuuChild::where("hnID", $req->_parentID)
                ->where("user_id", Auth::id());

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

    // public function DeleteChildFile(Request $req)
    // {
    //     try {
    //         $row = DalanJilSanhuuChild::find($req->id);

    //         if (!$row) {
    //             return response([
    //                 "status" => "error",
    //                 "msg" => "Мэдээлэл олдсонгүй"
    //             ], 404);
    //         }

    //         $fileUrl = $req->file_url;   // устгах файл

    //         // 1. Storage path гаргаж авна
    //         $path = str_replace(asset(''), '', $fileUrl); // url → storage/...

    //         // 2. Файлыг серверээс устгана
    //         if (Storage::exists($path)) {
    //             Storage::delete($path);
    //         }

    //         // 3. DB дээрх file_ner-ээс уг файлыг арилгана
    //         $files = explode(';', $row->file_ner);
    //         $newFiles = [];

    //         foreach ($files as $f) {
    //             if ($f != "" && $f != $fileUrl) {
    //                 $newFiles[] = $f;
    //             }
    //         }

    //         $row->file_ner = implode(';', $newFiles);
    //         if ($row->file_ner != "") {
    //             $row->file_ner .= ';';
    //         }

    //         $row->save();

    //         return response([
    //             "status" => "success",
    //             "msg" => "Файл амжилттай устгагдлаа"
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "Файл устгах үед алдаа гарлаа"
    //         ], 500);
    //     }
    // }

    public function DeleteChildFile(Request $req)
    {
        try {
            $row = DalanJilSanhuuChild::find($req->id);

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
        // try {
        //     $row = DalanJilSanhuuChild::find($req->id);

        //     if (!$row) {
        //         return response([
        //             "status" => "error",
        //             "msg" => "Мэдээлэл олдсонгүй"
        //         ], 404);
        //     }

        //     $fileUrl = $req->file_url;

        //     // 🔥 1. URL-ээс зөв relative path гаргаж авна
        //     $parsed = parse_url($fileUrl);
        //     $relativePath = ltrim($parsed['path'], '/');
        //     // одоо: doc/BaingaIlt/4/abc.pdf

        //     // 🔥 2. public path дээр бүрэн зам үүсгэнэ
        //     $fullPath = public_path($relativePath);
        //     // C:/.../public/doc/BaingaIlt/4/abc.pdf

        //     // 🔥 3. Файлыг устгана
        //     if (File::exists($fullPath)) {
        //         File::delete($fullPath);
        //     }

        //     // 🔥 4. DB дээрх file_ner-ээс арилгана
        //     $files = explode(';', $row->file_ner);
        //     $newFiles = [];

        //     foreach ($files as $f) {
        //         if ($f != "" && $f != $fileUrl) {
        //             $newFiles[] = $f;
        //         }
        //     }

        //     $row->file_ner = implode(';', $newFiles);
        //     if ($row->file_ner != "") {
        //         $row->file_ner .= ';';
        //     }

        //     $row->save();

        //     return response([
        //         "status" => "success",
        //         "msg" => "Файл амжилттай устгагдлаа"
        //     ], 200);
        // } catch (\Throwable $th) {
        //     return response([
        //         "status" => "error",
        //         "msg" => "Файл устгах үед алдаа гарлаа"
        //     ], 500);
        // }
    }


    public function DeleteDalanJilsanhuuChild(Request $req)
    {
        try {
            $delete = DalanJilSanhuuChild::find($req->id);
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
                'h_type' => "4",
                'successful' => "Устгасан",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            if (!empty($delete->file_ner)) {

                // 🔑 encrypted → decrypt
                $decryptedFiles = Crypt::decryptString($delete->file_ner);

                $files = explode(';', $decryptedFiles);

                foreach ($files as $fileUrl) {

                    if (empty($fileUrl)) continue;

                    $parsedUrl = parse_url($fileUrl);

                    if (!isset($parsedUrl['path'])) continue;

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
    // {
    //     try {
    //         $delete = DalanJilSanhuuChild::find($req->id);

    //         if (!$delete) {
    //             return response([
    //                 "status" => "error",
    //                 "msg" => "Мэдээлэл олдсонгүй."
    //             ], 404);
    //         }

    //         if (!empty($delete->file_ner)) {

    //             $files = explode(';', $delete->file_ner);

    //             foreach ($files as $fileUrl) {

    //                 if (empty($fileUrl)) continue;

    //                 // 🔥 URL → PATH зөв хөрвүүлэлт
    //                 $parsedUrl = parse_url($fileUrl);

    //                 if (!isset($parsedUrl['path'])) continue;

    //                 // /storage/doc/BaingaIlt/5/123/file1.pdf
    //                 $relativePath = $parsedUrl['path'];

    //                 // 🔥 /storage/ гэдгийг тасдана
    //                 $relativePath = str_replace('/storage/', '', $relativePath);

    //                 // public/doc/BaingaIlt/5/123/file1.pdf
    //                 $storagePath = 'public/' . $relativePath;

    //                 if (Storage::exists($storagePath)) {
    //                     Storage::delete($storagePath);
    //                 }
    //             }
    //         }

    //         $delete->delete();

    //         return response([
    //             "status" => "success",
    //             "msg" => "Амжилттай устгалаа."
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => $th->getMessage()
    //         ], 500);
    //     }
    // }

    public function NewDalanJilsanhuuChild(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/DalanJilSanhuu/{$userId}";
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

                $getPDFUrl = 'storage/doc/DalanJilSanhuu/' . $userId . '/' . $setPDFPathID;
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
                'h_type' => "4",
                'successful' => "Нэмсэн",
                'user_angiID' => Auth::user()->angi_id,
                'user_salbarID' => Auth::user()->salbar_id,
                'user_id' => Auth::user()->id,
                'user_ip' => $req->ip(),
            ]);

            $insertBainga = new DalanJilSanhuuChild();
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
    // {
    //     $userId = Auth::id();
    //     $userFolder = "public/doc/DalanJilSanhuu/{$userId}";
    //     $fullURL = "";

    //     if (!Storage::exists($userFolder)) {
    //         Storage::makeDirectory($userFolder);
    //     }




    //     DB::beginTransaction();

    //     try {

    //         $savedFiles = []; 
    //         foreach ($req->data_url as $value) {
    //             $pdf_data = $value["fileimage"];
    //             $pdf_64 = substr($pdf_data, strpos($pdf_data, ',') + 1);
    //             $pdfContent = base64_decode($pdf_64);


    //             $originalName = $value["filename"];
    //             $setPDFPathID = uniqid() . '_' . $originalName;
    //             $path = $userFolder . "/" . $setPDFPathID;

    //             Storage::put($path, $pdfContent, 'public');
    //             $savedFiles[] = $path;

    //             $getPDFUrl = 'storage/doc/DalanJilSanhuu/' . $userId . '/' . $setPDFPathID;
    //             $fullURL .= asset($getPDFUrl) . ';';
    //         }


    //         $insertBainga = new DalanJilSanhuuChild();
    //         $insertBainga->hnID = $req->hnID;
    //         $insertBainga->barimt_ner = $req->barimt_ner;
    //         $insertBainga->barimt_ognoo = $req->barimt_ognoo;
    //         $insertBainga->barimt_dugaar = $req->barimt_dugaar; 
    //         $insertBainga->irsen_dugaar = $req->irsen_dugaar;
    //         $insertBainga->yabsan_dugaar = $req->yabsan_dugaar;
    //         $insertBainga->uild_gazar = $req->uild_gazar;
    //         $insertBainga->huudas_too = $req->huudas_too;
    //         $insertBainga->habsralt_too = $req->habsralt_too;
    //         $insertBainga->huudas_dugaar = $req->huudas_dugaar;
    //         $insertBainga->aguulga = $req->aguulga;
    //         $insertBainga->bichsen_ner = $req->bichsen_ner;
    //         $insertBainga->bichsen_ognoo = $req->bichsen_ognoo;
    //         $insertBainga->file_ner = $fullURL;
    //         $insertBainga->user_id = $userId;
    //         $insertBainga->save();

    //         DB::commit();

    //         return response([
    //             "status" => "success",
    //             "msg" => "Амжилттай хадгаллаа."
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         DB::rollBack();


    //         foreach ($savedFiles as $path) {
    //             if (Storage::exists($path)) {
    //                 Storage::delete($path);
    //             }
    //         }

    //         return response([
    //             "status" => "error",
    //             "msg" => $th->getMessage()
    //         ], 500);
    //     }
    // }

    public function EditDalanJilsanhuuChild(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/DalanJilSanhuu/{$userId}";
        $fullURL = "";

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
        }

        try {

            $edit = DalanJilSanhuuChild::find($req->id);

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

                    $url = asset('storage/doc/DalanJilSanhuu/' . $userId . '/' . $filename);

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
                'h_type' => "4",
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
    // {
    //     $userId = Auth::id();
    //     $userFolder = "public/doc/DalanJilSanhuu/{$userId}";
    //     $fullURL = "";

    //     if (!Storage::exists($userFolder)) {
    //         Storage::makeDirectory($userFolder);
    //     }

    //     try {

    //         if ($req->old_files) {
    //             foreach ($req->old_files as $file) {
    //                 $fullURL .= $file['url'] . ';';
    //             }
    //         }


    //         if ($req->data_url) {


    //             $existingFiles = $req->old_files
    //                 ? array_map(fn($f) => basename($f['url']), $req->old_files)
    //                 : [];

    //             foreach ($req->data_url as $value) {
    //                 $filename = $value["filename"];
    //                 $path = $userFolder . "/" . $filename;


    //                 if (in_array($filename, $existingFiles)) continue;


    //                 if (Storage::exists($path)) {
    //                     return response([
    //                         "status" => "error",
    //                         "msg" => "Файл \"{$filename}\" аль хэдийн байна!"
    //                     ], 422);
    //                 }


    //                 if (!isset($value["fileimage"]) || !$value["fileimage"]) {
    //                     return response([
    //                         "status" => "error",
    //                         "msg" => "File image хоосон байна: {$filename}"
    //                     ], 422);
    //                 }


    //                 $pdf_64 = substr($value["fileimage"], strpos($value["fileimage"], ',') + 1);
    //                 $pdfContent = base64_decode($pdf_64, true); 

    //                 if ($pdfContent === false) {
    //                     return response([
    //                         "status" => "error",
    //                         "msg" => "Base64 decode амжилтгүй боллоо: {$filename}"
    //                     ], 422);
    //                 }

    //                 Storage::put($path, $pdfContent, 'public');

    //                 $fullURL .= asset('storage/doc/DalanJilSanhuu/' . $userId . '/' . $filename) . ';';
    //             }
    //         }


    //         $edit = DalanJilSanhuuChild::find($req->id);
    //         if (!$edit) {
    //             return response([
    //                 "status" => "error",
    //                 "msg" => "ID: {$req->id} -тай бичлэг олдсонгүй!"
    //             ], 404);
    //         }

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
    //         $edit->file_ner = $fullURL;
    //         $edit->user_id = $userId;

    //         $edit->save();

    //         return response([
    //             "status" => "success",
    //             "msg" => "Амжилттай заслаа."
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response([
    //             "status" => "error",
    //             "msg" => "Алдаа гарлаа: " . $th->getMessage(),
    //             "trace" => $th->getTraceAsString()
    //         ], 500);
    //     }
    // }
    public function ChildDalanJilSanhuuImport(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new DalanJilSanhuuChildImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
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
    //         $edit = DalanJilSanhuuChild::find($req->id);

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
}
