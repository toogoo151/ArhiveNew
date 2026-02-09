<?php

use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ComandController;
use App\Http\Controllers\AngiController;
use App\Http\Controllers\SalbarController;
use App\Http\Controllers\HutheregController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\HumrugController;
use App\Http\Controllers\DansController;
use App\Http\Controllers\BaingaIltController;
use App\Http\Controllers\SedevZuiController;
use App\Http\Controllers\JagsaaltController;
use App\Http\Controllers\BaingaIltChildController;
use App\Http\Controllers\BaingaNuutsController;
use App\Http\Controllers\BaingaNuutsChildController;
use App\Http\Controllers\TurNuutsController;
use App\Http\Controllers\TurNuutsChildController;
use App\Http\Controllers\TurIltController;
use App\Http\Controllers\TurIltChildController;
use App\Http\Controllers\DalanJilHunController;
use App\Http\Controllers\DalanJilhunChildController;
use App\Http\Controllers\DalanJilSanhuuController;
use App\Http\Controllers\DalanJilSanhuuChildController;






use Illuminate\Support\Facades\DB;














use App\Models\all_users;

use App\Models\Control;

use App\Models\MainHistory;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Models\Comandlal;
use App\Models\Angi;
use App\Models\Salbar;
use App\Models\ProgrammType;
use App\Models\UserType;
use App\Models\SecType;
use App\Models\Huthereg;
use App\Models\Humrug;
use App\Models\Dansburtgel;
use App\Models\BaingaIlt;
use App\Models\BaingaNuuts;
use App\Models\TurNuuts;
use App\Models\TurIlt;
use App\Models\DalanJilHun;
use App\Models\DalanJilSanhuu;

// Туслах моделууд
use App\Models\jagsaaltZuilDugaar;
use App\Models\SedevZuiModel;
use App\Models\ArhivTovchlolModel;












Route::group(['middleware' => ['web', 'auth']], function () {
    Route::post('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');
});

Route::get('/', [FrontendController::class, "showBlade"])->name('home');
Auth::routes(['register' => false, 'verify' => true]);

Route::get("show", [ShowController::class, "show"]);

// Route::get('/home', [App\Http\Controllers\AdminController::class, 'showBlade'])->name('home');
Route::group(['prefix' => 'laravel-filemanager', 'middleware' => ['web', 'auth']], function () {
    \UniSharp\LaravelFilemanager\Lfm::routes();
});



Route::middleware('auth')->get('/get/auth/name', function () {
    return response()->json(['name' => auth()->user()->hereglegch_ner ?? null]);
});



Route::get("/get/auth/id", function () {
    $user = new all_users;
    $userId = $user->getUserId();
    return $userId;
});


Route::get("/get/auth", function () {
    $user = new User;
    return $user->getUser();
});
Route::get("/get/auth/name", function () {
    $user = Auth::user();
    return $user ? $user->getUserName() : "Нэвтрээгүй байна";
});

Route::get("/get/auth/tuvshin", function () {
    $user = Auth::user();
    return $user ? $user->getTuvshin() : "Нэвтрээгүй байна";
});




Route::get("/get/auth/image", function () {
    $user = new all_users;
    return $user->getUserImage();
});
// get admin about end










//Хэрэглэгч start

Route::get("/get/ProgrammType", function () {
    $programmType = new ProgrammType();
    return $programmType->getPtype();
});
Route::get("/get/UserType", function () {
    $UserType = new UserType();
    return $UserType->getUtype();
});
Route::get("/get/SecType", function () {
    $SecType = new SecType();
    return $SecType->getSectype();
});

Route::post("/get/byAngiID", [UserController::class, "getAngiID"]);

Route::get("/get/user", function () {
    $user = new User();
    return $user->getUser();
});

Route::post("/new/user", [UserController::class, "NewUser"]);
Route::post("/edit/user", [UserController::class, "EditUser"]);
Route::post("/delete/user", [UserController::class, "DeleteUser"]);

//Хэрэглэгч end

//Командлал start


Route::get("/get/comandlal", function () {
    $comandlal = new Comandlal();
    return $comandlal->getComandlal();
});
// Route::get("/get/comandlal", [ComandController::class, "getComandlal"]);
Route::post("/new/comandlal", [ComandController::class, "NewComandlal"]);
Route::post("/delete/comandlal", [ComandController::class, "DeleteComandlal"]);
Route::post("/edit/comandlal", [ComandController::class, "EditComandlal"]);
//Командлал end

//Анги start
Route::get("/get/angi", function () {
    $angi = new Angi();
    return $angi->getAngi();
});

// Route::get("/get/angi", [AngiController::class, "getAngi"]);
Route::post("/delete/angi", [AngiController::class, "DeleteAngi"]);
Route::post("/new/angi", [AngiController::class, "NewAngi"]);
Route::post("/edit/angi", [AngiController::class, "EditAngi"]);

//Анги end

//Салбар start
Route::get("/get/salbar", function () {
    $salbar = new Salbar();
    return $salbar->getSalbar();
});
Route::post("/get/angi/byComandlalID", [SalbarController::class, "getAngiID"]);
Route::post("/delete/salbar", [SalbarController::class, "DeleteSalbar"]);
Route::post("/new/salbar", [SalbarController::class, "NewSalbar"]);
Route::post("/edit/salbar", [SalbarController::class, "EditSalbar"]);
//Салбар end

//Хөтлөх хэргийн жагсаалт start
Route::get("/get/Huthereg", function () {
    $huthereg = new Huthereg();
    return $huthereg->getHuthereg();
});
Route::post("/delete/huthereg", [HutheregController::class, "DeleteHuthereg"]);
Route::post("/new/huthereg", [HutheregController::class, "NewHuthereg"]);
Route::post("/edit/huthereg", [HutheregController::class, "EditHuthereg"]);

//Хөтлөх хэргийн жагсаалт end

//Хөмрөг start
Route::get("/get/Humrug", function () {
    $humrug = new Humrug();
    return $humrug->getHumrug();
});
Route::post("/delete/humrug", [HumrugController::class, "DeleteHuthereg"]);
Route::post("/new/humrug", [HumrugController::class, "NewHumrug"])
    ->middleware('auth');
Route::post("/edit/humrug", [HumrugController::class, "EditHumrug"])
    ->middleware('auth');;
Route::get("/get/humrugType", [HumrugController::class, "HumrugType"]);
//Хөмрөг end


//Данс бүртгэл start
Route::get("/get/Dans", function () {
    $dans = new Dansburtgel();
    return $dans->getDans();
});

Route::get("/get/Humrugs", function () {
    $dans = new Dansburtgel();
    return $dans->getHumrugs();
});
Route::get("/get/Retention", function () {
    $dans = new Dansburtgel();
    return $dans->getRetention();
});
Route::get("/get/secretType", function () {
    $dans = new Dansburtgel();
    return $dans->getSecType();
});

Route::post("/delete/dans", [DansController::class, "DeleteDans"]);
Route::post("/new/dans", [DansController::class, "NewDans"])
    ->middleware('auth');
Route::post("/edit/dans", [DansController::class, "EditDans"])
    ->middleware('auth');
//Данс бүртгэл end

// Байнга хадгалах Илт start
Route::get("/get/BaingaIlt", function () {
    $baingaIlt = new BaingaIlt();
    return $baingaIlt->getBaingaIlt();
});

Route::get("/get/Dansburtgel/{humrugID}", function ($humrugID) {
    $baingaIlt = new BaingaIlt();
    return $baingaIlt->getDansburtgelByHumrug($humrugID);
});
Route::post("/delete/BaingaIlt", [BaingaIltController::class, "DeleteBaingIlt"]);
Route::post("/new/BaingaIlt", [BaingaIltController::class, "NewBaingIlt"])
    ->middleware('auth');
Route::post("/edit/BaingaIlt", [BaingaIltController::class, "EditBaingIlt"])
    ->middleware('auth');

//arvhive shiluuleh start
Route::post("/archive/BaingaIlt", [BaingaIltController::class, "ArchiveBaingIlt"]);

Route::get("/get/ArchiveBaingaIlt", function () {
    $ArchiveBaingIlt = new BaingaIlt();
    return $ArchiveBaingIlt->getArchiveBaingIlt();
});
//arhive shiljuuleh end

// Байнга хадгалах Илт end

//Childtable Байнга хадгалах барим бичиг start
Route::post("/get/baingaIltsChild", [BaingaIltChildController::class, "ChildBaingIlt"]);
Route::post("/delete/baingaIltChild", [BaingaIltChildController::class, "DeleteChildBaingIlt"]);
Route::post("/new/baingaIltChild", [BaingaIltChildController::class, "NewChildBaingIlt"])
    ->middleware('auth');
Route::post("/edit/baingaIltChild", [BaingaIltChildController::class, "EditChildBaingIlt"])
    ->middleware('auth');
Route::post("/delete/baingaIltChildFile", [BaingaIltChildController::class, "DeleteChildFile"]);
//Childtable Байнга хадгалах барим бичиг end


///Байнга хадгалах Нууц start
Route::get("/get/BaingaNuuts", function () {
    $baingaNuuts = new BaingaNuuts();
    return $baingaNuuts->getBaingaNuuts();
});

Route::get("/get/DansburtgelNuuts/{humrugID}", function ($humrugID) {
    $baingaNuuts = new BaingaNuuts();
    return $baingaNuuts->getDansburtgelByNuutsHumrug($humrugID);
});
Route::post("/delete/BaingaNuuts", [BaingaNuutsController::class, "DeleteBaingaNuuts"]);
Route::post("/new/BaingaNuuts", [BaingaNuutsController::class, "NewBaingaNuuts"])
    ->middleware('auth');
Route::post("/edit/BaingaNuuts", [BaingaNuutsController::class, "EditBaingaNuuts"])
    ->middleware('auth');
//Байнга хадгалах Нууц end

//nuuts archive shiljuuleh start
Route::post("/archive/BaingaNuuts", [BaingaNuutsController::class, "ArchiveBaingNuuts"]);

Route::get("/get/archiveBaingaNuuts", function () {
    $ArchiveBaingNuuts = new BaingaNuuts();
    return $ArchiveBaingNuuts->getArchiveBaingNuuts();
});

//nuuts archive shiljuuleh end


//Байнга хадгалах нууц баримт бичиг child start
Route::post("/get/baingaNuutsChild", [BaingaNuutsChildController::class, "ChildBaingaNuuts"]);
Route::post("/delete/baingaNuutsChild", [BaingaNuutsChildController::class, "DeleteChildBaingaNuuts"]);
Route::post("/new/baingaNuutsChild", [BaingaNuutsChildController::class, "NewChildBaingNuuts"])
    ->middleware('auth');
Route::post("/edit/baingaNuutsChild", [BaingaNuutsChildController::class, "EditChildBaingaNuuts"])
    ->middleware('auth');
Route::post("/delete/baingaNuutsChildFile", [BaingaNuutsChildController::class, "DeleteNuutsChildFile"]);

//Байнга хадгалах нууц баримт бичиг child end



///Түр хадгалах Нууц start
Route::get("/get/TurNuuts", function () {
    $turNuuts = new TurNuuts();
    return $turNuuts->getTurNuuts();
});

Route::get("/get/DansburtgelTurNuuts/{humrugID}", function ($humrugID) {
    $turNuuts = new TurNuuts();
    return $turNuuts->getDansburtgelByTurNuutsHumrug($humrugID);
});
Route::post("/delete/TurNuuts", [TurNuutsController::class, "DeleteTurNuuts"]);
Route::post("/new/TurNuuts", [TurNuutsController::class, "NewTurNuuts"])
    ->middleware('auth');
Route::post("/edit/TurNuuts", [TurNuutsController::class, "EditTurNuuts"])
    ->middleware('auth');
//Түр хадгалах Нууц end

//Түр хадгалах нууц баримт бичиг child start
Route::post("/get/TurNuutsChild", [TurNuutsChildController::class, "ChildTurNuuts"]);
Route::post("/delete/TurNuutsChild", [TurNuutsChildController::class, "DeleteChildTurNuuts"]);
Route::post("/new/TurNuutsChild", [TurNuutsChildController::class, "NewChildTurNuuts"])
    ->middleware('auth');
Route::post("/edit/TurNuutsChild", [TurNuutsChildController::class, "EditChildTurNuuts"])
    ->middleware('auth');
Route::post("/delete/TurNuutsChildFile", [TurNuutsChildController::class, "DeleteTurNuutsChildFile"]);
//Түр хадгалах нууц баримт бичиг child end



//nuuts archive shiljuuleh start
// Route::post("/archive/BaingaNuuts", [BaingaNuutsController::class, "ArchiveBaingNuuts"]);

// Route::get("/get/archiveBaingaNuuts", function () {
//     $ArchiveBaingNuuts = new BaingaNuuts();
//     return $ArchiveBaingNuuts->getArchiveBaingNuuts();
// });

// Түр хадгалах Илт start
Route::get("/get/TurIlt", function () {
    $turIlt = new TurIlt();
    return $turIlt->getTurIlt();
});

Route::get("/get/DansburtgelTurIlt/{humrugID}", function ($humrugID) {
    $turIlt = new TurIlt();
    return $turIlt->getDansburtgelTurByHumrug($humrugID);
});
Route::post("/delete/TurIlt", [TurIltController::class, "DeleteTurIlt"]);
Route::post("/new/TurIlt", [TurIltController::class, "NewTurIlt"])
    ->middleware('auth');
Route::post("/edit/TurIlt", [TurIltController::class, "EditTurIlt"])
    ->middleware('auth');

// arvhive shiluuleh start
Route::post("/archive/TurIlt", [TurIltController::class, "ArchiveTurIlt"]);

Route::get("/get/ArchiveTurIlt", function () {
    $ArchiveTurIlt = new TurIlt();
    return $ArchiveTurIlt->getArchiveTurIlt();
});
// arhive shiljuuleh end

//Childtable Түр хадгалах баримт бичиг start Илт
Route::post("/get/TurIltsChild", [TurIltChildController::class, "ChildTurIlt"]);
Route::post("/delete/TurIltChild", [TurIltChildController::class, "DeleteChildTurIlt"]);
Route::post("/new/TurIltChild", [TurIltChildController::class, "NewChildTurIlt"])
    ->middleware('auth');
Route::post("/edit/TurIltChild", [TurIltChildController::class, "EditChildTurIlt"])
    ->middleware('auth');
Route::post("/delete/TurIltChildFile", [TurIltChildController::class, "DeleteChildFile"]);
//Childtable Түр хадгалах баримт бичиг end Илт




//Dalan jil Hunii Nuuts start 
Route::get("/get/DalanJilHun", function () {
    $dalanjilHun = new DalanJilHun();
    return $dalanjilHun->getDalanJilHun();
});

Route::get("/get/DansburtgelDalanjilHun/{humrugID}", function ($humrugID) {
    $dalanjilHun = new DalanJilHun();
    return $dalanjilHun->DalanjilHunByHumrug($humrugID);
});

Route::post("/delete/DalanJilHun", [DalanJilHunController::class, "DeleteDalanJilHun"]);
Route::post("/new/DalanJilHun", [DalanJilHunController::class, "NewDalanJilHun"])
    ->middleware('auth');
Route::post("/edit/DalanJilHun", [DalanJilHunController::class, "EditDalanJilHun"])
    ->middleware('auth');

//Dalan jil Hunii Nuuts end 


//Dalan jil Hunii nuuts Child start 
Route::post("/get/DalanJilhunChild", [DalanJilhunChildController::class, "ChildDalanJilhunChild"]);
Route::post("/delete/DalanJilhunChild", [DalanJilhunChildController::class, "DeleteDalanJilhunChild"]);
Route::post("/new/DalanJilhunChild", [DalanJilhunChildController::class, "NewDalanJilhunChild"])
    ->middleware('auth');
Route::post("/edit/DalanJilhunChild", [DalanJilhunChildController::class, "EditDalanJilhunChild"])
    ->middleware('auth');
Route::post("/delete/DalanJilhunChildFile", [DalanJilhunChildController::class, "DeleteChildFile"]);
//Dalan jil hunii nuuts child end

//Dalan jil hunii nuuuts archive start 
Route::post("/archive/DalanJilHun", [DalanJilHunController::class, "ArchiveDalanJilHun"]);

Route::get("/get/ArchiveDHun", function () {
    $ArchiveDaljilHun = new DalanJilHun();
    return $ArchiveDaljilHun->getArchiveDalanJilhun();
});
//Dalan jil hunii nuuuts archive end 


//Dalan jil Sanhuu start 
Route::get("/get/DalanJilSanhuu", function () {
    $DalanJilSanhuu = new DalanJilSanhuu();
    return $DalanJilSanhuu->getDalanJilSanhuu();
});

Route::get("/get/DansburtgelDalanjilSanhuu/{humrugID}", function ($humrugID) {
    $DalanJilSanhuu = new DalanJilSanhuu();
    return $DalanJilSanhuu->DalanJilSanhuuByHumrug($humrugID);
});

Route::post("/delete/DalanJilSanhuu", [DalanJilSanhuuController::class, "DeleteDalanJilSanhuu"]);
Route::post("/new/DalanJilSanhuu", [DalanJilSanhuuController::class, "NewDalanJilSanhuu"])
    ->middleware('auth');
Route::post("/edit/DalanJilSanhuu", [DalanJilSanhuuController::class, "EditDalanJilSanhuu"])
    ->middleware('auth');

//Dalan jil Sanhuu  end 


//Dalan jil Sanhuu  Child start 
Route::post("/get/DalanJilsanhuuChild", [DalanJilSanhuuChildController::class, "ChildDalanJilsanhuuChild"]);
Route::post("/delete/DalanJilsanhuuChild", [DalanJilSanhuuChildController::class, "DeleteDalanJilsanhuuChild"]);
Route::post("/new/DalanJilsanhuuChild", [DalanJilSanhuuChildController::class, "NewDalanJilsanhuuChild"])
    ->middleware('auth');
Route::post("/edit/DalanJilsanhuuChild", [DalanJilSanhuuChildController::class, "EditDalanJilsanhuuChild"])
    ->middleware('auth');
Route::post("/delete/DalanJilsanhuuChildFile", [DalanJilSanhuuChildController::class, "DeleteChildFile"]);
//Dalan jil Sanhuu child end

//Dalan jil Sanhuu archive start 
Route::post("/archive/DalanJilSanhuu", [DalanJilSanhuuController::class, "ArchiveDalanJilSanhuu"]);

Route::get("/get/ArchiveDalanJilSanhuu", function () {
    $ArchiveDaljilSanhuu = new DalanJilSanhuu();
    return $ArchiveDaljilSanhuu->getArchiveDalanJilSanhuu();
});
//Dalan jil Sanhuu archive end 




// GANBAT NEMSEN START

// Jagsaalt start
Route::get("/get/jagsaalt", function () {
    $dans = new jagsaaltZuilDugaar();
    return $dans->getJagsaalt();
});
Route::post("new/jagsaalt", [JagsaaltController::class, "NewJagsaalt"])
    ->middleware('auth');
Route::post("edit/jagsaalt", [JagsaaltController::class, "EditJagsaalt"])
    ->middleware('auth');
Route::post("delete/jagsaalt", [JagsaaltController::class, "DeleteJagsaalt"])
    ->middleware('auth');
// Jagsaalt end

// Sedev zui zaagch start
Route::get("/get/sedevzuils", function () {
    $sedev = new SedevZuiModel();
    return $sedev->getSedevZui();
});
Route::post("new/sedevzui", [SedevZuiController::class, "NewSedevZui"])
    ->middleware('auth');
Route::post("edit/sedevzui", [SedevZuiController::class, "EditSedevZui"])
    ->middleware('auth');
Route::post("delete/sedevzui", [SedevZuiController::class, "DeleteSedevZui"])
    ->middleware('auth');
// Sedev zui zaagch end


// Arhiv tovchlol  start
Route::get("/get/tovchlol", function () {
    $arhivtovchlol = new \App\Models\ArhivTovchlolModel();
    return $arhivtovchlol->getTovchlol();
});
Route::post("new/tovchlol", [\App\Http\Controllers\ArhivTovchlolController::class, "NewTovchlol"])
    ->middleware('auth');
Route::post("edit/tovchlol", [\App\Http\Controllers\ArhivTovchlolController::class, "EditTovchlol"])
    ->middleware('auth');
Route::post("delete/tovchlol", [\App\Http\Controllers\ArhivTovchlolController::class, "DeleteTovchlol"])
    ->middleware('auth');
// Arhiv tovchlol  end


// Ashig nom  start
Route::get("/get/ashignoms", function () {
    $ashignom = new \App\Models\AshigNomModel();
    return $ashignom->getNom();
});
Route::post("new/ashignom", [\App\Http\Controllers\AshigNomController::class, "NewNom"])
    ->middleware('auth');
Route::post("edit/ashignom", [\App\Http\Controllers\AshigNomController::class, "EditNom"])
    ->middleware('auth');
Route::post("delete/ashignom", [\App\Http\Controllers\AshigNomController::class, "DeleteNom"])
    ->middleware('auth');
// Ashig nom  end

// Jagsaalt TURUL START
Route::get('/get/jagsaaltturuldugaar', function () {
    return DB::table('jagsaaltzuildugaar')->get();
});

Route::get('/get/jagsaaltTurul', function () {
    return DB::table('jagsaalt_turul')->get();
});
Route::get('/get/hugatsaaTurul', function () {
    return DB::table('retention_period')->get();
});


// Jagsaalt TURUL END



// GANBAT NEMSEN END




// STATISTIC START
Route::post("/get/summary", [StatisticController::class, "summary"]);
Route::post("/get/monthly-stat", [StatisticController::class, "monthlyStat"]);
Route::post("/get/group-stat", [StatisticController::class, "groupStat"]);
Route::post("/get/ClaccCount", [StatisticController::class, "ClassCount"]);
Route::post("/get/Usercount", [StatisticController::class, "UserCount"]);
Route::post("/get/HutheregCount", [StatisticController::class, "HutheregCount"]);
// Ganbat nemeh
Route::post("/get/JagsaaltCount", [StatisticController::class, "JagsaaltCount"]);
Route::post("/get/SedevZuiCount", [StatisticController::class, "SedevZuiCount"])->middleware('auth');
Route::post("/get/NomCount", [StatisticController::class, "NomCount"])->middleware('auth');
Route::post("/get/TovchCount", [StatisticController::class, "TovchCount"])->middleware('auth');
// GANBAT NEMSEN START
Route::post("/get/JagsaaltCount", [StatisticController::class, "JagsaaltCount"])->middleware('auth');
//STATISTIC END








Route::any('{catchall}', [FrontendController::class, "showBlade"])->where('catchall', '.*');
