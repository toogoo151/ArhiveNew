<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Page;
use Illuminate\Http\Request;
use Laravel\Ui\Presets\React;
use File;
use Response;
// use GuzzleHttp\Psr7\Response;

class PageController extends Controller
{

//     public function zaawarPdf(){
//         return Response::make(file_get_contents('images/zaawar.pdf'), 200, [
//                        'content-type'=>'application/pdf',
//                    ]);
//    }
    // public function (){
    //     return view("page.zaawar");
    // }
       public function zaawar(){
    return view("page.zaawar");
    }

        public function ereld(){
  return Response::make(file_get_contents('images/neelt.pdf'), 200, [
                       'content-type'=>'application/pdf',
                   ]);
    }

        public function haalt(){
  return Response::make(file_get_contents('images/haalt.pdf'), 200, [
                       'content-type'=>'application/pdf',
                   ]);
    }

         public function start(){
  return Response::make(file_get_contents('images/start.pdf'), 200, [
                       'content-type'=>'application/pdf',
                   ]);
    }

         public function end(){
  return Response::make(file_get_contents('images/end.pdf'), 200, [
                       'content-type'=>'application/pdf',
                   ]);
    }

            public function hamtdaa(){
  return Response::make(file_get_contents('images/Hamtdaa.pdf'), 200, [
                       'content-type'=>'application/pdf',
                   ]);
    }



    public function first(){
        $post = DB::table("pko_one_page")
          ->where("pko_one_page.menuID" ,"=" , "Анхдагч нар")
          ->first();
            return view("page.first", compact("post"));
    }
       public function pride(){
        $post = DB::table("pko_one_page")
          ->where("pko_one_page.menuID" ,"=" , "Бидний бахархал")
          ->first();
            return view("page.pride", compact("post"));
    }
     public function womens(){
        $post = DB::table("pko_one_page")
          ->where("pko_one_page.menuID" ,"=" , "Эмэгтэйчүүд")
          ->first();
            return view("page.women", compact("post"));
    }
       public function active(){
        $post = DB::table("pko_one_page")
          ->where("pko_one_page.menuID" ,"=" , "Идэвхтэй ажиллагаа")
          ->first();
            return view("page.active", compact("post"));
    }

     public function image(){
        $postImages = DB::table('tb_album')
        ->where("image", "!=", "")
        ->paginate(15);

        return view('page.image', compact('postImages'));
}

 public function get(){
        $News = DB::table("pko_one_page")
        // ->where("pko_one_page.adminID", "=", Auth::user()->id)
        ->get();
        return $News;
}
public function video(){
    return view("page.video");
}


public function delete(Request $req){
    try {
        $delete = Page::find($req->id);
        $delete->delete();
        return response(
            array(
                "status" => "success",
                "msg" => "Амжилттай устгалаа."
            ), 200);
    } catch (\Throwable $th) {
        return response(
            array(
                "status" => "error",
                "msg" => "Алдаа гарлаа"
            ), 500);
    }
}
public function edit(Request $req){
        try {
            $edit = Page::find($req->id);
            $edit->title = $req->title;
            $edit->body = $req->body;
            $edit->save();
            return response(
                array(
                    "status" => "success",
                    "msg" => "Амжилттай заслаа."
                ), 200);
        } catch (\Throwable $th) {
            return $th;
            return response(
                array(
                    "status" => "error",
                    "msg" => "Алдаа гарлаа"
                ), 500);
        }

}

// public function new(Request $req){
//     try {
//         $insertlist = new Page();
//         $insertlist->adminID = Auth::user()->id;
//         $insertlist->title = $req->title;
//         $insertlist->body = $req->body;
//         $insertlist->menuID = $req->menuID;
//         $insertlist->save();
//         return response(
//             array(
//                 "status" => "success",
//                 "msg" => "Амжилттай хадгаллаа."
//             ), 200);
//     } catch (\Throwable $th) {
// return $th;
//         return response(
//             array(
//                 "status" => "error",
//                 "msg" => "Алдаа гарлаа"
//             ), 500);
//     }
// }




}
