@extends('layouts.app')
@section('content')
<script>
    function myFunction(){
        if(document.getElementById('password').value == document.getElementById('password-confirmation').value && document.getElementById('password').value.length > 7){
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
                <div class="card-header">{{ __('Нууц үг шинэчлэх') }}</div>

                <div class="card-body">

                    <form method="POST" action="{{ route('reset.update', ['hash' => $reset_hash]) }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="code" class="col-md-4 col-form-label text-md-end">{{ __('Шинэ нууц үг') }}</label>
                            <div class="col-md-6 mb-2">
                                <input type="hidden" name="email" value="{{ $email }}">
                                <input id="password" type="password" class="form-control" name="password" placeholder="Шинэ нууц үг" required autocomplete="off" autofocus oninput="myFunction()">
                            </div>
                            <label for="code" class="col-md-4 col-form-label text-md-end">{{ __('Шинэ нууц үг давтах') }}</label>
                            <div class="col-md-6">
                                <input id="password-confirmation" type="password" class="form-control" name="password_confirmation" placeholder="Шинэ нууц үг давтах" required autocomplete="off" autofocus oninput="myFunction()">
                                <span class="text-danger small" id='error'>
                                    {{ __($message) }}
                                </span>
                            </div>
                        </div>
                        <div class="row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary" id='confirmation' disabled>
                                {{ __('Шинэчлэх') }}
                            </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection
