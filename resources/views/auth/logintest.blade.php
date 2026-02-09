@extends('layouts.app')
@section('content')
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital@1&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link rel="dns-prefetch" href="//fonts.gstatic.com">


    <script src="https://kit.fontawesome.com/a81368914c.js" crossorigin="anonymous"></script>

    <!--Zagvarlag alert-->
    <link rel="stylesheet" href="{{ asset('/z-alert/css/alertify.core.css') }}" />
    <link rel="stylesheet" href="{{ asset('/z-alert/css/alertify.default.css') }}" />
    <script src="{{ asset('/z-alert/js/alertify.min.js') }}"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
    <!--Zagvarlag alert-->







</head>
<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400i,600,700,800&display=swap');
*{
margin: 0;
padding: 0;
box-sizing: border-box;
font-family: "Open Sans", sans-serif;
}
.menu-container{
position: absolute;
top: 8%;
left: 65%;
transform: translate(-50%, -50%);
width: 300px;
display: none;
align-items: center;
justify-content: center;
}
.button{
position: relative;
background: #0f639b;
color: white;
font-size: 20px;
padding: 8px 20px;
width: 150px;
line-height: 30px;
display: flex;
align-items: center;
justify-content: space-between;
border-radius: 25px;
cursor: pointer;
transition: width .4s;
}
.button.expand{
width: 40%;
}
.fas.expand:before{
content: '\f00d';
}
ul{
list-style: none;
position: absolute;
top: 65px;
display: block;
background: #0f639b;
width: 70%;
text-align: center;
border-radius: 5px;
display: none;
box-shadow: 0 3px 6px rgba(0,0,0,0.3);
}
ul:before{
position: absolute;
content: '';
width: 20px;
height: 20px;
background: #0f639b;
top: -10px;
right: 15px;
transform: rotate(45deg);
z-index: -1;
}
ul li{
line-height: 35px;
padding: 8px 20px;
cursor: pointer;
border: 1px solid transparent;
border-bottom: 1px solid rgba(255,255,255,.1);
}
ul li:last-child{
border-bottom: none;
}
ul li:hover{
box-shadow: inset 0 0 5px #33ffff,
            inset 0 0 10px #66ffff;
}
ul li:hover:first-child{
border-radius: 5px 5px 0 0;
}
ul li:hover:last-child{
border-radius: 0 0 5px 5px;
}
ul li a{
color: white;
font-size: 18px;
text-decoration: none;
}
ul li:hover a{
color: cyan;
}
</style>
<style>
    *{
        padding:0;
        margin:0;
        box-sizing:border-box;
    }
        /* body {
            font-family: 'Poppins', sans-serif;
        } */
        .wave{
            position: fixed;
            height: 100%;
            left: 0;
            bottom: 0;
            z-index: -1;
        }
        .container{
            width: 100vw;
            height: 100vh;
            display: grid;
            grid-template-columns: repeat(2,1fr);
            grid-gap: 15rem;
            padding: 0 2rem;
        }
     .login-container {
    display: flex;
    align-items: center;
    text-align: center;
}

@media only screen and (max-width: 768px) {
    /* Styles for screens up to 768px */
    .login-container {
        flex-direction: column;
    }
}

@media only screen and (max-width: 480px) {
    /* Styles for screens up to 480px */
    .login-container {
        /* Adjust the styles as per your requirements for smaller screens */
    }
}
        .cont1{
                position: none;
               left: -25px;
                padding: 55px 65px;

                /* background: #fff; */
                background: rgba(255,255,255,0.05);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border-radius: 25px;
                /* backdrop-filter: blur(80px); */
                z-index: 1;
                transition: 0.5s;
                color: black;
                background-color:rgb(255, 255, 255, 0.4);
                /* background-color: rgb(254, 255, 255); */
                /* opacity: 2; */
            }


            .cont2{
                position: none;
                left: -50px;

                /* padding: 10px 10px; */
                /* background: #fff; */
                /* background: rgba(255,255,255,0.05); */
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                width: 300px;
                height: 300px;
                background-image: radial-gradient(white, rgb(28, 230, 162), blue);
                margin-top:150px;
                margin-left: 150px;

                border-radius: 50%;
                /* border-radius: 50%; */
                /* backdrop-filter: blur(80px); */

                transition: 0.5s;
                color: black;
                background-color:rgb(255, 255, 255, 0.9);
                /* background-color: rgb(254, 255, 255); */
                /* opacity: 2; */
            }

            .cont1:hover{
                left: -20px;
                padding: 60px 65px;
            }

        .img{
            /* display: flex;
            justify-content: flex-end;
            align-items: center; */
        }

/* Default styles for the .form element */
.form {
    width: 100%; /* Set the initial width to 100% for responsiveness */
    max-width: 460px; /* Set a maximum width to limit the element's width on larger screens */
}

/* Media query for screens smaller than 460px (phones) */
@media (max-width: 460px) {
    .form {
        width: 100%; /* Set the width to 100% to fill the available space */
        /* Adjust other properties as needed for smaller screens */
    }
}

/* Media query for screens between 461px and 1024px (notebooks) */
@media (min-width: 461px) and (max-width: 1024px) {
    .form {
        width: 80%; /* Adjust the width percentage as desired for notebooks */
        /* Adjust other properties as needed for notebook screens */
    }
    .cont1 {
        padding: 35px; /* Adjust the padding value as desired for notebook screens */
        /* Adjust other properties as needed for notebook screens */
    }
}

/* Media query for screens larger than 1024px (PCs) */
@media (min-width: 1025px) {
    .form {
        width: 60%; /* Adjust the width percentage as desired for PC screens */
        /* Adjust other properties as needed for PC screens */
    }
}


        .img img{
            width: 500px;
            /* margin-right: 50px; */
            /* margin-top: -10%; */
        }

        .avatar{
            width: 220px;
            text-align: center;
            justify-content: center;
            align-items: center;

        }
        .form h2{
            font-size: 2.9em;
            text-transform: uppercase;
            margin: 15px 0;
            color: #333;
        }
        .input-div{
            position: relative;
            display: grid;
            grid-template-columns: 7% 93%;
            margin: 25px 0;
            padding: 5px 0;
            color: black;
            border-bottom: 2px solid #ffffff;
        }
        ::placeholder{
            color: rgb(0, 0, 0);
            opacity: 1;
        }
        .input-div:after, .input-div::before{
            content: '';
            position: absolute;
            bottom: -2px;
            width:0;
            height: 2px;
            background-color: #00B0FF;
            transition: .3s;
        }
        .input-div::after{
            right: 50%;
        }
        .input-div::before{
            left: 50%;
        }
        .input-div.focus .i i{
            color: #00B0FF;
        }

        .input-div.focus div h5{
            top: -5px;
            font-size: 15px;
        }

        .input-div.focus:after,.input-div.focus:before{
            width: 50%;
        }

        .input-div.one{
            margin-top: 0;
        }
        .input-div.two{
            margin-bottom: 4px;
        }
        .i{
            display:flex;
            justify-content: center;
            align-items: center;
        }

        .i i {
            color: #ffffff;
            transition: .3s;
        }
        .input-div > div{
            position: relative;
            height: 45px;
        }

        .input-div > div h5{
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            font-size: 18px;
            /* display: none; */
            transition: .3s;
        }
        .input{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border: none;
            outline: none;
            background: none;
            padding: 0.5rem 0.7rem;
            font-size: 1.2rem;
            font-family: 'Poppins', sans-serif;
            color: #555;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus{
            font-size: 1.2rem;
            font-family: 'Poppins', sans-serif;
            -webkit-background-clip: text;
            -webkit-text-fill-color: #454545;
        }
        a{
            display: block;
            text-align: right;
            text-decoration: none;
            color: #999;
            font-size:0.9rem;
            transition: .3s;
        }
        .a:hover{
            color: #00B0FF;
            /* font-size: 5px; */
        }
        .btn{
            display: block;
            width:100%;
            /* height: 50%; */
            border-radius: 25px;
            margin: 1rem 0;
            font-size: 1.2rem;
            outline: 0;
            border:none;
            background-image: linear-gradient(to right,#4234da,#2ac3d1, #0388e7);
            cursor: pointer;
            color: #fff;
            text-transform: uppercase;
            font-family: 'Poppins', sans-serif;
            background-size: 200%;
            transition: .5s;
        }
        .btn:hover{
            background-position: right;
        }
        /* @media screen and (max-width:2000px){
            .container{
                grid-gap: 5rem;
            }

        } */
        @media screen and (max-width: 768px) {
  body {
    background-size: contain;
    background-repeat: no-repeat;
  }
}

        @media screen and (max-width:1050px){
            .container{
                grid-gap: 5rem;
            }

        }
        @media screen and (max-width:1000px){
            form{
                width: 290px;
                height: -100px;
            }
            form h2{
                font-size: 2.4rem;
                margin: 8px 0;
            }
        .img img{
            width: 400px;
        }
    }

    @media screen and (max-width:900px){
        .img{
            display: none ;
        }
            .topnav{
        display:none !important;
                    }

        .menu-container{
            display:flex;
        }

        .container{
            grid-template-columns: 1fr;
        }
        /* .wave{
            display: none;
        } */
        .login-container{
            justify-content: center;
        }
        .cont1{
            width: 100%;
            height: 92%;
        }
        body {
/* overflow: hidden; */
    }
    .avatar{
            width: 170px;

        }
    }
            body {
    --menu-item-size: 50px;
    --green-color: #16284c;
    --blue-color: #1286d3;
    --dark-green-color: #539cd8;
    --white-color: #FFF;
    --gray-color: #EDEDED;
    --line-offset: calc((100% - var(--container-height))/ 2 + var(--menu-item-size) + 0.6em);
    background-image: url("/images/55.png");
    background-size: cover;
    backdrop-filter: blur(6px);
    overflow: hidden;
/* background-blend-mode: normal; */


        }

    .topnav {
    display: flex;
    list-style: none;
    /* top:00px; */
    margin: auto 100px;
    padding: 0.6em 0 0 0;
    /* left: 50%;  */
    /* top: -25px; */

        }

.topnav> a li {
    box-sizing: border-box;
    height: var(--menu-item-size);
    width: calc(4.5 * var(--menu-item-size));
    line-height: var(--menu-item-size);
    padding: 0 2em;
    margin: 1px;
    transition: 0.5s linear all;
    background: var(--green-color);
    color: var(--dark-green-color);
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    user-select: none;
        }

        .topnav > a li:not(.with-submenu) {
    clip-path: polygon(10% 0%, 0% 100%, 95% 100%, 100% 50%, 95% 0%);
    shape-outside: polygon(10% 0%, 0% 100%, 95% 100%, 100% 50%, 95% 0%);
}
.topnav > a li:nth-child(2) {
    transform: translateX(-5%);
}

.topnav > a li:nth-child(3) {
    transform: translateX(-10%)
}

.topnav>a  li:nth-child(4) {
    transform: translateX(-15%)
}

.topnav i {
    margin-right: 5px;
}

.topnav > li:hover:not(.active) {
    background: linear-gradient(to right, var(--green-color), var(--blue-color));
    color: var(--white-color);
}

.topnav >a  li:active:not(.active),
.topnav >a  li:active:not(.with-submenu){
    background: var(--blue-color);
    color: var(--white-color);
}

.topnav >a li:hover i:not(li.active) {
    color: #202020;
}

.topnav .active {
    color: var(--white-color);
    background: var(--blue-color);
    cursor: default;
    text-shadow: 1px 1px 1px var(--dark-green-color);
    font-size: 16px;
}

.topnav a li:hover {
--size: 200px;
position: relative;
width: var(--size);
/* height: calc(var(--size) * 0.66); */
/* background-image: linear-gradient(135deg, #70F570 10%, #49C628 100%); */
color: #1a1a1b!important;

border-radius: 10px;
        }

.topnav a li :hover:after {
content: '';
position: absolute;
bottom: 0;
left: 50%;
width: 0;
height: 0;
border: calc(var(--size) * 0.13) solid transparent;
border-bottom: 0;
margin-left: calc(var(--size) * 0.13 * -1);
margin-bottom: calc(var(--size) * 0.13 * -1);
        }
        .com{
            text-align: center;
            justify-content: center;
            align-items: center;
            margin-top: -100px;
            top: -170px;
        }

</style>
<script>
    function myfunc(){
        var url = window.location.href
        var cleanUrl = url.split('?')[0];
        window.history.replaceState(null, null, cleanUrl);
    }
</script>
<body>

<img class="wave" src="images/wave.png">

<div class="topnav">
        <a href="{{url("/info/onePost/1")}}" style="color: white"> <li style="color: white"><i class="fa fa-file" aria-hidden="true" style="color: white">&nbsp;</i>Бидний тухай</li></a>
        <a href="{{url("/image")}}" style="color: white"> <li style="color:white"> <i class="fa fa-picture-o" aria-hidden="true" style="color: white">&nbsp;</i>Зургийн цомог</li></a>

        <a href="{{url("/announcement")}}" style="color: white"> <li style="color:white"> <i class="fa fa-bell" aria-hidden="true" style="color: white">&nbsp;</i>Зарлал</li></a>
          <a href="{{url("/zaawar")}}" target="_blank" style="color: white"> <li style="color:white"> <i class="fa fa-file-pdf-o" aria-hidden="true" style="color: white">&nbsp;</i>Заавар</li></a>
        <a href="{{url("/login")}}" style="color: white">  <li class="active"><i class="fa fa-sign-in" aria-hidden="true" style="color: white">&nbsp; </i>Нэвтрэх</li></a>
</div>

<div class="container">

    <div class="img">
        {{-- <br>

        <br> <br> <br> <br> <br> <br> <br> --}}
            {{-- <div class="cont2"> --}}
                {{-- <img class="com" src="images/12.gif" style="width:780px;height:480px;margin-top:250px;margin-left:-350px;"> --}}
                {{-- <img class="base" src="images/66.png" style="width:680px;height:480px;margin-top:-450px;margin-left:-185px;"> --}}

            {{-- </div> --}}

    </div>

    <div class="menu-container">
        <div class="button">
            Меню
            <span class="fas fa-bars" id="drop_down"></span>
        </div>
        <ul>
            <li><a href="{{url("/info/onePost/1")}}">Бидний тухай</a></li>
            <li><a href="{{url("/image")}}">Зургийн цомог</a></li>
            <li><a href="{{url("/announcement")}}">Зарлал</a></li>
            <li><a href="{{url("/zaawar")}}" target="_blank">Заавар</a></li>
            <li><a href="{{url("/login")}}">Нэвтрэх</a></li>
        </ul>
    </div>

        <div class="login-container">
            <form method="POST" action="{{ route('login') }}">
                @csrf
                <div class="cont1">
                <img class="avatar" src="images/12.gif" alt="">
                <br>  <br>

                        {{-- <b><h2>НЭВТРЭХ ХЭСЭГ<h2></b> --}}
                    <div class="input-div one">
                        <div class="i">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div>

                            <input id="email" type="email" class="input" placeholder="Хэрэглэгчийн нэр"  class="form-control @error('email') is-invalid @enderror" name="email"
                                value="{{ old('email') }}" required autocomplete="email" autofocus>

                        </div>
                            {{-- @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                @enderror --}}
                    </div>

                    <div class="input-div two">
                        <button id="togglePassword" type="button" onclick="togglePasswordVisibility()" style="background-color: transparent; border: none;">
                            <div class="i">
                                <i id="lockIcon" class="fas fa-lock"></i>
                            </div>
                        </button>
                        <div>
                            @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror

                            <input id="password" type="password" class="input" placeholder="Нууц үг" name="password"
                                required autocomplete="current-password" autofocus>
                            <br/>
                            <br/>
                        </div>
                    </div>

                    <style>
                        #lockIcon.fa-unlock {
                            color: red;
                        }
                    </style>

                    <script>
                        function togglePasswordVisibility() {
                            var passwordInput = document.getElementById("password");
                            var lockIcon = document.getElementById("lockIcon");

                            if (passwordInput.type === "password") {
                                passwordInput.type = "text";
                                lockIcon.className = "fas fa-unlock";
                            } else {
                                passwordInput.type = "password";
                                lockIcon.className = "fas fa-lock";
                            }
                        }
                    </script>

                    <a href="{{route('verification.notice')}}" style="color:black">
                        Имэйл баталгаажуулах
                    </a>
                    <br/>
                    <a href="{{route('reset.show')}}" style="color:black" >
                        Нууц үгээ мартсан уу?
                    </a>

                    <input type="submit" class="btn" value="Нэвтрэх" onclick="myfunc()">
                    @error('email')
                    <input class="invalid-feedback" role="alert">
                        <h5>{{ $message }}</h5>
                        @enderror
                        <span id='paramParent' role="alert">
                            <h5 id='paramMessage'><?php
                                if (isset($_GET['message'])) {
                                    echo "Имэйл баталгаажуулна уу";
                                }
                                $param1 = filter_input(INPUT_GET, 'message', FILTER_SANITIZE_STRING);
                                ?></h5>
                        </span>





                                </div>
                    {{-- <button type="submit"  >
                        {{ __('Нэвтрэх') }}
                    </button> --}}
                </form>
            </div>
            </div>
            </div>
{{-- <script type="text.javascript" src="js/main.js"></script> --}}
{{-- <script src="{{ asset('js/main.js') }}" defer></script> --}}
<script>
        $(document).ready(function(){
        $('.button').click(function(){
            if($(this).hasClass('expand')){
            $('ul').slideUp(function(){
                $('.button').removeClass('expand');
                $('.fas').removeClass('expand')
            });
            }else{
            $(this).addClass('expand');
            setTimeout(function(){
                $('#drop_down').addClass('expand');
                $('ul').stop().slideDown();
            },200);
            }
        });
        });
    </script>

    <script>
  window.addEventListener("load", function() {
    document.documentElement.style.overflow = 'hidden';  // Hide the scrollbar of the browser window
  });
</script>
</body>

@endsection
