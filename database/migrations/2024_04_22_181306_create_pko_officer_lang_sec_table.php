<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePkoOfficerLangSecTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pko_officer_lang_sec', function (Blueprint $table) {
            $table->id();
            $table->integer('missionID');
            $table->integer('eeljID');
            $table->integer('genderID');
            $table->integer('readCol');
            $table->integer('writeCol');
            $table->integer('listenCol');
            $table->integer('speakCol');
            $table->float('totalScore');
            $table->integer('alcpt');
            $table->string('languageEdit')->nullable();
            $table->string('successful');
            $table->integer('admin_id');
            $table->string('admin_name');
            $table->string('admin_email');
            $table->string('adminRD');
            $table->string('objectName');
            $table->string('objectmail');
            $table->string('objectRD');
            $table->string('user_ip');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pko_officer_lang_sec');
    }
}
