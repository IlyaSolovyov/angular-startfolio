﻿import { Component, Output } from '@angular/core';

@Component({
    selector: 'login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    password: string;

    doLogin(ev) {
        //some login actions
    }
}