import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-product',
    styleUrls: ['./product.component.css'],
    templateUrl: './product.component.html'
})
export class ProductComponent {
    public title = "Денчик";
    public backgroundColorClass = "material-red";
    public productImgUrl = "Images//BA.jpg";
    public productImgAlt = "alternative content";
    public mainText = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
    public subText = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
}