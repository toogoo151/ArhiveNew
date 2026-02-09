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
        {{-- <link href="{{ asset('/backend/plugins/overlayScrollbars/css/OverlayScrollbars.min.css') }}" rel="stylesheet"> --}}
        <link href="{{ asset('/backend/plugins/daterangepicker/daterangepicker.css') }}" rel="stylesheet">
        {{-- <link href="{{ asset('/backend/plugins/summernote/summernote-bs4.min.css') }}" rel="stylesheet"> --}}





        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">



    </head>
    <body class="hold-transition sidebar-mini layout-fixed">
    {{-- <div id="headerMenu"></div>
    <div id="asideMenu"></div>
    <div id="content"></div>
    <div id="footer"></div> --}}
    <div id="body-content"></div>

  <!-- Control Sidebar -->
  {{-- <aside class="control-sidebar control-sidebar-dark"> --}}
    <!-- Control sidebar content goes here -->
  {{-- </aside> --}}

    </body>


    <script src="{{ asset('/backend/plugins/jquery/jquery.min.js') }}" defer></script>
    {{-- <script src="{{ asset('/backend/plugins/jquery-ui/jquersy-ui.min.js') }}" defer></script> --}}
    <script src="{{ asset('/backend/plugins/bootstrap/js/bootstrap.bundle.min.js') }}" defer></script>
    {{-- <script src="{{ asset('/backend/plugins/chart.js/Chart.min.js') }}" defer></script> --}}
    {{-- <script src="{{ asset('/backend/plugins/sparklines/sparkline.js') }}" defer></script> --}}
    {{-- <script src="{{ asset('/backend/plugins/jqvmap/jquery.vmap.min.js') }}" defer></script> --}}
    {{-- <script src="{{ asset('/backend/plugins/jqvmap/maps/jquery.vmap.usa.js') }}" defer></script> --}}
    {{-- <script src="{{ asset('/backend/plugins/jquery-knob/jquery.knob.min.js') }}" defer></script> --}}
    <script src="{{ asset('/backend/plugins/moment/moment.min.js') }}"></script>
    <script src="{{ asset('/backend/plugins/daterangepicker/daterangepicker.js') }}" defer></script>
    <script src="{{ asset('/backend/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js') }}" defer></script>
    <!-- Select2 -->
    <script src="{{ asset('/backend/plugins/select2/js/select2.full.min.js') }}" defer></script>
    {{-- <script src="{{ asset('/backend/plugins/summernote/summernote-bs4.min.js') }}" defer></script> --}}
    {{-- <script src="{{ asset('/backend/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js') }}" defer></script> --}}
    <script src="{{ asset('/backend/dist/js/adminlte.js') }}" defer></script>

    {{-- <script src="{{ asset('/backend/dist/js/demo.js') }}" defer></script> --}}
    {{-- <script src="{{ asset('/backend/dist/js/pages/dashboard.js') }}" defer></script> --}}
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@10"></script>

    <script src="{{ asset('js/app2.js') }}" defer></script>

</html>
