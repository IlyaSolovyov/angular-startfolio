import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-fab',
    styleUrls: ['./fab.component.css'],
    templateUrl: './fab.component.html'
})
export class FabComponent {
    public backgroundIcon = "dist/icons/edit.svg";
}