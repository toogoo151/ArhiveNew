<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BaingaNuutsChild;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// use Redirect, Response, File;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use App\Imports\BainganuutsChildImport;
use Maatwebsite\Excel\Facades\Excel;





class BaingaNuutsChildController extends Controller
{

    public function ChildBaingaNuuts(Request $req)
    {
        try {
            $baingaNuutsChild = BaingaNuutsChild::where("hnID", "=", $req->_parentID)
                ->where("arhivbainga_nuuts.user_id", Auth::id())
                ->orderBy('id', 'desc')
                // $BaingaNuutsChild = DB::table("db_arhivbaingilt")
                // ->where("way_parent", "=", $req->_parentID)
                ->get()
                ->map(function ($item) {
                    $item->barimt_ner = $item->barimt_ner ? Crypt::decryptString($item->barimt_ner) : null;
                    $item->uild_gazar = $item->uild_gazar ? Crypt::decryptString($item->uild_gazar) : null;
                    $item->aguulga = $item->aguulga ? Crypt::decryptString($item->aguulga) : null;
                    $item->bichsen_ner = $item->bichsen_ner ? Crypt::decryptString($item->bichsen_ner) : null;
                    $item->file_ner = $item->file_ner ? Crypt::decryptString($item->file_ner) : null;
                    return $item;
                });
            return $baingaNuutsChild;
        } catch (\Throwable $th) {
            // throw $th;
        }
    }



    public function DeleteNuutsChildFile(Request $req)
    {
        try {

            $row = BaingaNuutsChild::find($req->id);

            if (!$row) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй"
                ], 404);
            }

            $fileUrl = $req->file_url;

            /* 🔐 1. encrypted file_ner → decrypt */
            try {
                $decryptedFiles = Crypt::decryptString($row->file_ner);
            } catch (\Exception $e) {
                $decryptedFiles = "";
            }

            /* 🔥 2. URL → relative path */
            $parsed = parse_url($fileUrl);

            if (isset($parsed['path'])) {

                $relativePath = ltrim($parsed['path'], '/');

                $fullPath = public_path($relativePath);

                if (File::exists($fullPath)) {
                    File::delete($fullPath);
                }
            }

            /* 🔥 3. DB дээрх file list update */
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

            /* 🔐 4. дахин encrypt */
            $row->file_ner = $newFileString
                ? Crypt::encryptString($newFileString)
                : null;

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


    public function DeleteChildBaingaNuuts(Request $req)
    {
        try {

            $delete = BaingaNuutsChild::find($req->id);

            if (!$delete) {
                return response([
                    "status" => "error",
                    "msg" => "Мэдээлэл олдсонгүй."
                ], 404);
            }

            if (!empty($delete->file_ner)) {

                // 🔐 decrypt хийх
                $decryptedFiles = Crypt::decryptString($delete->file_ner);

                $files = explode(';', $decryptedFiles);

                foreach ($files as $fileUrl) {

                    if (empty($fileUrl)) continue;

                    $parsedUrl = parse_url($fileUrl);

                    if (!isset($parsedUrl['path'])) continue;

                    $relativePath = $parsedUrl['path'];

                    $relativePath = str_replace('/storage/', '', $relativePath);

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

    public function NewChildBaingNuuts(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/BaingaNuuts/{$userId}";
        $fullURL = "";

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
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

                $originalName = $value["filename"];
                $setPDFPathID = uniqid() . '_' . $originalName;
                $path = $userFolder . "/" . $setPDFPathID;

                Storage::put($path, $pdfContent, 'public');
                $savedFiles[] = $path;

                $getPDFUrl = 'storage/doc/BaingaNuuts/' . $userId . '/' . $setPDFPathID;
                $fullURL .= asset($getPDFUrl) . ';';
            }

            // 2b. DB-д хадгалах
            $insertBainga = new BaingaNuutsChild();
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

    public function EditChildBaingaNuuts(Request $req)
    {
        $userId = Auth::id();
        $userFolder = "public/doc/BaingaNuuts/{$userId}";
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

                    $fullURL .= asset('storage/doc/BaingaNuuts/' . $userId . '/' . $filename) . ';';
                }
            }

            /* 3️⃣ DB update */
            $edit = BaingaNuutsChild::find($req->id);
            if (!$edit) {
                return response([
                    "status" => "error",
                    "msg" => "ID: {$req->id} -тай бичлэг олдсонгүй!"
                ], 404);
            }

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

    //     $userFolder = "public/doc/BaingaNuuts/{$userId}";
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

    //             $getPDFUrl = 'storage/doc/BaingaNuuts/' . $userId . '/' . $setPDFPathID;
    //             $fullURL .= asset($getPDFUrl) . ';';
    //         }
    //     }

    //     try {
    //         $edit = BaingaNuutsChild::find($req->id);

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

    public function importBaingaNuutsChild(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new BainganuutsChildImport, $request->file('file'));

        return response()->json([
            'msg' => 'Амжилттай импорт хийлээ'
        ]);
    }
}
