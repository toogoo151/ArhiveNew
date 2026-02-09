
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header text-center">{{ __('Таны имэйл амжилттай баталгаажлаа') }}
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('reset.setPassword')}}">
                        @csrf
                            <input type="hidden" name="email" value="{{ $email }}">
                            <input type="hidden" name="reset_hash" value="{{ $reset_hash }}">
                        <div class="row mb-0">
                            <div class="align-items-center justify-content-center d-flex">
                                <button type="submit" class="btn btn-primary" id='confirmation'>
                                {{ __('Нууц үг тохируулах') }}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
