import { Component, Output } from '@angular/core';

@Component({
    selector: 'teammate',
    styleUrls: ['./teammate.component.css'],
    templateUrl: './teammate.component.html'
})
export class TeammateComponent {
    public teammates_Name = "Ilya Solovyov";
    public teammates_Photo = "Images//SO.jpg";
    public teammates_Description = "make oXXXymiron great again...";
    public button_text = "oXXXymiron";
}