import { Component, Output } from '@angular/core';
import { MnFullpageOptions, MnFullpageService } from 'ngx-fullpage';

@Component({
    selector: 'some',
    templateUrl: `./some.component.html`
})
export class SomeComponent {
    constructor(public fullpageService: MnFullpageService) {
    }
}