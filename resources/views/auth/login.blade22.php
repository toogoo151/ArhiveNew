@extends('layouts.app')

@section('content')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="{{ asset('css/loginStyle.css') }}">
    <title>НЭВТРЭХ</title>

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
<script>
    function myfunc(){
        var url = window.location.href
        var cleanUrl = url.split('?')[0];
        window.history.replaceState(null, null, cleanUrl);
    }
</script>
<body>
 <div class="wrapper">
    <nav class="nav">
        <div class="nav-logo">
            <label>
                    <img style="width: 90px; height: 110px; padding-top: 30px;" src="{{ url("images/GsmafLogo.png") }}" alt="Logo">
            </label>
        </div>
        <div class="nav-menu" id="navMenu">
            <ul>
                <li><a href="{{url("/info/onePost/1")}}" class="link active">Бидний тухай</a></li>
                <li><a href="{{url("/image")}}" class="link">Зургийн цомог</a></li>
                <li><a  href="{{url("/announcement")}}" class="link">Зарлал</a></li>
                <li><a href="{{url("/zaawar")}}" target="_blank" class="link">Заавар</a></li>
            </ul>
        </div>
        <div class="nav-button">
            <button class="btn white-btn" id="loginBtn" onclick="login()">Нэвтрэх</button>
        </div>
        <div class="nav-menu-btn">
            <i class="bx bx-menu" onclick="myMenuFunction()"></i>
        </div>
    </nav>

<!----------------------------- Form box ----------------------------------->
    <div class="form-box">

        <!------------------- login form -------------------------->

            <div class="login-container" id="login">
                <div class="cont1">
                    <div class="top">

                        <header><img style="width: 250px; height: 195px;" class="avatar" src="images/12.gif" alt=""></header>
                    </div>
                    <div class="input-box">
                        <input type="email" id="email" class="input-field" placeholder="Хэрэглэгчийн имэйл" name="email" value="{{old('email')}}" required autocomplete="email" autofocus class="form-control @error('email') is-invalid @enderror">
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box">
                        <div>
                            @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror

                            <input id="password" class="input-field" type="password"  placeholder="Нууц үг" name="password"
                                required autocomplete="current-password" autofocus>

                            <button id="togglePassword" type="button" onclick="togglePasswordVisibility()" style="background-color: transparent; border: none;">
                                <div class="i">
                                    <i id="lockIcon" class="bx bx-lock"></i>
                                </div>
                            </button>
                        </div>

                    </div>

                    <style>
                        #lockIcon.bx-lock-open {
                            color: red;
                        }
                    </style>

                    <script>
                        function togglePasswordVisibility() {
                            var passwordInput = document.getElementById("password");
                            var lockIcon = document.getElementById("lockIcon");

                            if (passwordInput.type === "password") {
                                passwordInput.type = "text";
                                lockIcon.className = "bx bx-lock-open";
                            } else {
                                passwordInput.type = "password";
                                lockIcon.className = "bx bx-lock";
                            }
                        }
                    </script>

                    <div class="input-box">
                        <input type="submit" class="submit" value="НЭВТРЭХ" onclick="myfunc()">
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
                        {{-- <a href="{{route('verification.notice')}}" style="color:black">
                            Имэйл баталгаажуулах
                        </a>
                        <br/> --}}
                        <div class="two-col">
                            <div class="one">
                            </div>
                            <div class="two">
                                <label ><a href="{{route('reset.show')}}">
                                    <h5>Нууц үгээ мартсан уу?</h5>
                                </a></label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


    </div>
</div>

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

<script>

   function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if(i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
   }

</script>

<script>

    var a = document.getElementById("loginBtn");
    var x = document.getElementById("login");

    function login() {
        x.style.left = "4px";
        a.className += " white-btn";
        x.style.opacity = 1;
    }



</script>

</body>
</html>
@endsection
