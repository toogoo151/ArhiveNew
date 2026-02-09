<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>АРХИВ ПРОГРАММ</title>
        <link href="{{url("images/Soldier.png")}}" rel="icon" />
        <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
    />
    <link href="{{ asset('frontend/lib/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('/backend/plugins/fontawesome-free/css/all.min.css') }}" rel="stylesheet">
        <link href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet">
        <link href="{{ asset('/backend/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') }}" rel="stylesheet">
        <link href="{{ asset('/backend/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}" rel="stylesheet">
        {{-- <link href="{{ asset('/backend/plugins/jqvmap/jqvmap.min.css') }}" rel="stylesheet"> --}}
        <link href="{{ asset('/backend/dist/css/adminlte.min.css') }}" rel="stylesheet">
          <!-- Select2 -->
        <link href="{{ asset('/backend/plugins/select2/css/select2.min.css') }}" rel="stylesheet">
        <link href="{{ asset('/backend/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}" rel="stylesheet">
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body class="hold-transition sidebar-mini layout-fixed">
        <div class="container">
            <h1> Та хандах эрхгүй байна</h1>
        </div>
    </body>
</html>
