<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DalanJilHunChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// use Redirect, Response, File;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DalanJilhunChildController extends Controller
{

    public function ChildDalanJilhunChild(Request $req)
    {
        try {
            $DalanJilHunChild = DalanJilHunChild::where("hnID", "=", $req->_parentID)
                ->orderBy('id', 'desc')
                // $DalanJilHunChild = DB::table("db_arhivbaingilt")
                // ->where("way_parent", "=", $req->_parentID)
                ->get();
            return $DalanJilHunChild;
        } catch (\Throwable $th) {
            // throw $th;
        }
    }

    // public function DeleteChildFile(Request $req)
    // {
    //     try {
    //         $row = DalanJilHunChild::find($req->id);

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
            $row = DalanJilHunChild::find($req->id);

            if (!$row) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй"
                ], 404);
            }

            $fileUrl = $req->file_url;

            // 🔥 1. URL-ээс зөв relative path гаргаж авна
            $parsed = parse_url($fileUrl);
            $relativePath = ltrim($parsed['path'], '/');
            // одоо: doc/BaingaIlt/4/abc.pdf

            // 🔥 2. public path дээр бүрэн зам үүсгэнэ
            $fullPath = public_path($relativePath);
            // C:/.../public/doc/BaingaIlt/4/abc.pdf

            // 🔥 3. Файлыг устгана
            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }

            // 🔥 4. DB дээрх file_ner-ээс арилгана
            $files = explode(';', $row->file_ner);
            $newFiles = [];

            foreach ($files as $f) {
                if ($f != "" && $f != $fileUrl) {
                    $newFiles[] = $f;
                }
            }

            $row->file_ner = implode(';', $newFiles);
            if ($row->file_ner != "") {
                $row->file_ner .= ';';
            }

            $row->save();

            return response([
                "status" => "success",
                "msg" => "Файл амжилттай устгагдлаа"
            ], 200);
        } catch (\Throwable $th) {
            return response([
                "status" => "error",
                "msg" => "Файл устгах үед алдаа гарлаа"
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

            if (!empty($delete->file_ner)) {

                $files = explode(';', $delete->file_ner);

                foreach ($files as $fileUrl) {

                    if (empty($fileUrl)) continue;

                    // 🔥 URL → PATH зөв хөрвүүлэлт
                    $parsedUrl = parse_url($fileUrl);

                    if (!isset($parsedUrl['path'])) continue;

                    // /storage/doc/BaingaIlt/5/123/file1.pdf
                    $relativePath = $parsedUrl['path'];

                    // 🔥 /storage/ гэдгийг тасдана
                    $relativePath = str_replace('/storage/', '', $relativePath);

                    // public/doc/BaingaIlt/5/123/file1.pdf
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

        // 1. Давхардсан файл шалгах
        foreach ($req->data_url as $value) {
            $setPDFPathID = $value["filename"];
            $path = $userFolder . "/" . $setPDFPathID;

            if (Storage::exists($path)) {
                return response([
                    "status" => "error",
                    "msg" => "Файл \"{$setPDFPathID}\" аль хэдийн хадгалагдсан байна!"
                ], 422);
            }
        }

        // 2. DB Transaction эхлэх
        DB::beginTransaction();

        try {
            // 2a. Файлуудыг хадгалах (амжилттай бол URL-г цуглуулах)
            $savedFiles = []; // хадгалагдсан файлуудын path
            foreach ($req->data_url as $value) {
                $pdf_data = $value["fileimage"];
                $pdf_64 = substr($pdf_data, strpos($pdf_data, ',') + 1);
                $pdfContent = base64_decode($pdf_64);

                $setPDFPathID = $value["filename"];
                $path = $userFolder . "/" . $setPDFPathID;

                Storage::put($path, $pdfContent, 'public');
                $savedFiles[] = $path;

                $getPDFUrl = 'storage/doc/DalanJilHun/' . $userId . '/' . $setPDFPathID;
                $fullURL .= asset($getPDFUrl) . ';';
            }

            // 2b. DB-д хадгалах
            $insertBainga = new DalanJilHunChild();
            $insertBainga->hnID = $req->hnID;
            $insertBainga->barimt_ner = $req->barimt_ner;
            $insertBainga->barimt_ognoo = $req->barimt_ognoo;
            $insertBainga->barimt_dugaar = $req->barimt_dugaar; // integer эсвэл validation шалгах
            $insertBainga->irsen_dugaar = $req->irsen_dugaar;
            $insertBainga->yabsan_dugaar = $req->yabsan_dugaar;
            $insertBainga->uild_gazar = $req->uild_gazar;
            $insertBainga->huudas_too = $req->huudas_too;
            $insertBainga->habsralt_too = $req->habsralt_too;
            $insertBainga->huudas_dugaar = $req->huudas_dugaar;
            $insertBainga->aguulga = $req->aguulga;
            $insertBainga->bichsen_ner = $req->bichsen_ner;
            $insertBainga->bichsen_ognoo = $req->bichsen_ognoo;
            $insertBainga->file_ner = $fullURL;
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
            /* 1️⃣ ХУУЧИН ФАЙЛУУДЫГ ЭХЛЭЭД НЭМНЭ */
            if ($req->old_files) {
                foreach ($req->old_files as $file) {
                    $fullURL .= $file['url'] . ';';
                }
            }

            /* 2️⃣ ШИНЭ ФАЙЛУУДЫГ UPLOAD ХИЙНЭ */
            if ($req->data_url) {

                // Хуучин файлын нэрс массив болгоно
                $existingFiles = $req->old_files
                    ? array_map(fn($f) => basename($f['url']), $req->old_files)
                    : [];

                foreach ($req->data_url as $value) {
                    $filename = $value["filename"];
                    $path = $userFolder . "/" . $filename;

                    // Хуучин файлын нэртэй бол давхар шалгахгүй
                    if (in_array($filename, $existingFiles)) continue;

                    // Сервер дээр давхар байгаа бол алдаа
                    if (Storage::exists($path)) {
                        return response([
                            "status" => "error",
                            "msg" => "Файл \"{$filename}\" аль хэдийн байна!"
                        ], 422);
                    }

                    // Fileimage байгаа эсэх шалгах
                    if (!isset($value["fileimage"]) || !$value["fileimage"]) {
                        return response([
                            "status" => "error",
                            "msg" => "File image хоосон байна: {$filename}"
                        ], 422);
                    }

                    // Base64 decode хийх
                    $pdf_64 = substr($value["fileimage"], strpos($value["fileimage"], ',') + 1);
                    $pdfContent = base64_decode($pdf_64, true); // strict=true

                    if ($pdfContent === false) {
                        return response([
                            "status" => "error",
                            "msg" => "Base64 decode амжилтгүй боллоо: {$filename}"
                        ], 422);
                    }

                    // Storage руу хадгалах
                    Storage::put($path, $pdfContent, 'public');

                    $fullURL .= asset('storage/doc/DalanJilHun/' . $userId . '/' . $filename) . ';';
                }
            }

            /* 3️⃣ DB update */
            $edit = DalanJilHunChild::find($req->id);
            if (!$edit) {
                return response([
                    "status" => "error",
                    "msg" => "ID: {$req->id} -тай бичлэг олдсонгүй!"
                ], 404);
            }

            $edit->barimt_ner = $req->barimt_ner;
            $edit->barimt_ognoo = $req->barimt_ognoo;
            $edit->barimt_dugaar = $req->barimt_dugaar;
            $edit->irsen_dugaar = $req->irsen_dugaar;
            $edit->yabsan_dugaar = $req->yabsan_dugaar;
            $edit->uild_gazar = $req->uild_gazar;
            $edit->huudas_too = $req->huudas_too;
            $edit->habsralt_too = $req->habsralt_too;
            $edit->huudas_dugaar = $req->huudas_dugaar;
            $edit->aguulga = $req->aguulga;
            $edit->bichsen_ner = $req->bichsen_ner;
            $edit->bichsen_ognoo = $req->bichsen_ognoo;
            $edit->file_ner = $fullURL;
            $edit->user_id = $userId;

            $edit->save();

            return response([
                "status" => "success",
                "msg" => "Амжилттай заслаа."
            ], 200);
        } catch (\Throwable $th) {
            // 🔥 Алдааг дэлгэрэнгүй харуулах
            return response([
                "status" => "error",
                "msg" => "Алдаа гарлаа: " . $th->getMessage(),
                "trace" => $th->getTraceAsString()
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
    //         $edit = DalanJilHunChild::find($req->id);

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
