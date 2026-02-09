@php
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
@endphp
@extends('layouts.app')

@section('content')
<script>
    function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) )
    return false;
  return true;
}
    function myFunction(){
        if(document.getElementById('code').value.length == 6){
            document.getElementById('confirmation').disabled = false
        }else{
            document.getElementById('confirmation').disabled = true
        }
    }
</script>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Имэйл баталгаажуулах') }}
                    <span>({{ __($email) }}{{ __(' рүү илгээсэн') }})</span>
                </div>
                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    <form method="POST" action="{{ route('verification.confirmCode') }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="code" class="col-md-4 col-form-label text-md-end">{{ __('Код') }}</label>
                            <div class="col-md-6">
                                <input type="hidden" name="email" value="{{ $email }}">
                                <input id="code" type="text" maxlength="6" class="form-control" name="code" value="{{ old('code') }}" placeholder="6-оронтой код " required autocomplete="off" autofocus onKeyPress="return isNumberKey(event)" oninput="myFunction()">

                                <span class="text-danger small">
                                    {{ $message ?? '' }}
                                </span>
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary" id='confirmation' disabled>
                                    {{ __('Баталгаажуулах') }}
                                </button>
                            </div>
                        </div>
                    </form>
                    {{-- <form action="{{ route('password.resend') }}" method="post" hidden={{$hideResend}}>
                        @csrf
                        <input type="hidden" name="email" value="{{ $email }}">
                        <a>
                          <span class="">Resend</span>
                        </a>
                      </form> --}}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
