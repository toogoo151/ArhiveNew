@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header text-center">{{ __($message) }}
                </div>
                <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                            </div>
                        </div>
                        <div class="row mb-0">
                            <div class="d-flex align-items-center justify-content-center">
                                <a class="btn btn-primary" href="{{route('verification.notice')}}">
                                    {{ __('Дахин оролдох') }}
                                </a>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
