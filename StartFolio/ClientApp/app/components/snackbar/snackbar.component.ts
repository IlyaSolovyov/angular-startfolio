import { Component, Input } from '@angular/core';

@Component({
    selector: 'snackbar',
    styleUrls: ['./snackbar.component.css'],
    templateUrl: './snackbar.component.html'
})
export class SnackbarComponent {
    @Input() message: string;
}