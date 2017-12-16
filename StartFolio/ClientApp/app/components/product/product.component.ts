import { Component, Output } from '@angular/core';
import { Page } from '../../page';
import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-product',
    styleUrls: ['./product.component.css'],
    templateUrl: './product.component.html'
})
export class ProductComponent extends PageBaseComponent {

    constructor(page: Page) {
        super(page);

        let details = JSON.parse(page.details);

        this.title           = details.title;
        this.backgroundColor = details.backgroundColor;
        this.productImgUrl   = details.productImgUrl;
        this.productImgAlt   = details.productImgAlt;
        this.mainText        = details.mainText;
        this.subText         = details.subText;
    }

    getBackgroundColor() {
        return this.backgroundColor;
    }

    public title           = "Денчик";
    public backgroundColor = "material-red";
    public productImgUrl   = "Images//BA.jpg";
    public productImgAlt   = "alternative content";
    public mainText        = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
    public subText         = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
}