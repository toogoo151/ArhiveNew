<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>АРХИВ ПРОГРАММ</title>
        <link href="{{url("images/Soldier.png")}}" rel="icon" />
        {{-- <script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.min.js">
      </script> --}}
  <link href="img/apple-touch-icon.png" rel="apple-touch-icon" />

  <!-- Google Fonts -->
  <link
  href="https://fonts.googleapis.com/css?family=Ruda:400,900,700"
  rel="stylesheet"
/>
    <!-- Font Awesome JS -->
    <script
      defer
      src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js"
      integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ"
      crossorigin="anonymous"
    ></script>

        <!-- Bootstrap CSS File -->
        {{-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"> --}}
        <link href="{{ asset('frontend/lib/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" />
        <!-- Libraries CSS Files -->
        <link href="{{ asset('/backend/plugins/fontawesome-free/css/all.min.css') }}" rel="stylesheet">

        <link href="{{ asset('frontend/lib/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('frontend/lib/prettyphoto/css/prettyphoto.css') }}" rel="stylesheet" />
        <link href="{{ asset('frontend/lib/hover/hoverex-all.css') }}" rel="stylesheet" />
        <link href="{{ asset('frontend/lib/jetmenu/jetmenu.css') }}" rel="stylesheet" />
        <link href="{{ asset('frontend/lib/owl-carousel/owl-carousel.css') }}" rel="stylesheet" />
        <!-- Main Stylesheet File -->
        <link href="{{ asset('frontend/css/style.css') }}" rel="stylesheet" />
        <link rel="stylesheet" href="{{ asset('frontend/css/colors/blue.css') }}" />
        <!-- sub menu -->
        <link rel="stylesheet" href="{{ asset('frontend/css/sidebar_menu_style1.css') }}" />
        <!-- <link rel="stylesheet" href="css/sidebar_menu_right.css" /> -->
        <link rel="stylesheet" href=" {{ asset('frontend/css/sidebar_menu_main.css') }}" />
        <link rel="stylesheet" href="{{ asset('frontend/icons/icomoon/style.css') }}" />
        <link rel="stylesheet" href="{{ asset('frontend/css/notification_style.css') }}" />
        <link rel="stylesheet" href="{{ asset('frontend/css/sub_menu_active.css') }}" />



        <link href="{{ asset('css/app1.css') }}" rel="stylesheet">

    </head>
<body>
    <div id="frontend_body_content"></div>
</body>


<div class="dmtop">Scroll to Top</div>



{{-- <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script> --}}
  {{-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script> --}}

<script src="{{ asset('frontend/lib/jquery/jquery.min.js') }}"></script>

<script src="{{ asset('frontend/lib/bootstrap/js/bootstrap.min.js') }}"></script>
<script src="{{ asset('frontend/lib/php-mail-form/validate.js') }}"></script>
<script src="{{ asset('frontend/lib/prettyphoto/js/prettyphoto.js') }}"></script>
<script src="{{ asset('frontend/lib/isotope/isotope.min.js') }}"></script>
<script src="{{ asset('frontend/lib/hover/hoverdir.js') }}"></script>
<script src="{{ asset('frontend/lib/hover/hoverex.min.js') }}"></script>
<script src="{{ asset('frontend/lib/unveil-effects/unveil-effects.js') }}"></script>
<script src="{{ asset('frontend/lib/owl-carousel/owl-carousel.js') }}"></script>
<script src="{{ asset('frontend/lib/jetmenu/jetmenu.js') }}"></script>
<script src="{{ asset('frontend/lib/animate-enhanced/animate-enhanced.min.js') }}"></script>
<script src="{{ asset('frontend/lib/jigowatt/jigowatt.js') }}"></script>
<script src="{{ asset('frontend/lib/easypiechart/easypiechart.min.js') }}"></script>

<!-- Template Main Javascript File -->
<script src="{{ asset('frontend/js/main.js') }}"></script>


  <script type="text/javascript">
    $(document).ready(function () {
      // $("#sidebar").toggleClass("active");
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
  </script>
  <script>
    $(document).ready(function () {
      jQuery(document).ready(function () {
        // jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
        jQuery(".colors a").click(function () {
          if ($(this).attr("class") != "default") {
            $("#jquery-accordion-menu").removeClass();
            $("#jquery-accordion-menu")
              .addClass("jquery-accordion-menu")
              .addClass($(this).attr("class"));
          } else {
            $("#jquery-accordion-menu").removeClass();
            $("#jquery-accordion-menu").addClass("jquery-accordion-menu");
          }
        });
      });
    });

    eval(
      (function (p, a, c, k, e, d) {
        e = function (c) {
          return c;
        };
        if (!"".replace(/^/, String)) {
          while (c--) {
            d[c] = k[c] || c;
          }
          k = [
            function (e) {
              return d[e];
            },
          ];
          e = function () {
            return "\\w+";
          };
          c = 1;
        }
        while (c--) {
          if (k[c]) {
            // p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
          }
        }
        return p;
      })()
    );
  </script>
  <script>
    $(".sub-menu ul").hide();
    $(".sub-menu a").click(function () {
      $(this).parent(".sub-menu").children("ul").slideToggle("100");
      $(this).find(".right").toggleClass("fa-caret-up fa-caret-down");
    });
  </script>
  <script src="{{ asset('js/app1.js') }}" defer></script>
    </html>
