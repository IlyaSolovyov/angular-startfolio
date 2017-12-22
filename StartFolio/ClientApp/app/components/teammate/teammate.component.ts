import { Component, Output, Input } from '@angular/core';

@Component({
    selector: 'teammate',
    styleUrls: ['./teammate.component.css'],
    templateUrl: './teammate.component.html'
})
export class TeammateComponent {
    @Input() name: string;
    @Input() photo: string;
    @Input() description: string;
    @Input() profileLink: string;
}