@php
   
@endphp
@extends('layouts.app')
@section('content')
<script>
    // Invalidate the session when the user is on this page
    @auth
        @php
            // Invalidate the session
            session()->invalidate();
        @endphp
        // Redirect the user to the login page
        var message = 'Email not verified';
        window.location.href = '{{ route('login') }}?message=' + encodeURIComponent(message);
    @endauth
</script>
<div class="container">
    heheh
</div>
@endsection
