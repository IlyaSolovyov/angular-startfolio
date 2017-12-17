import { Component, Output } from '@angular/core';
//import { Page } from '../../page';
//import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-product',
    styleUrls: ['./product.component.css'],
    templateUrl: './product.component.html'//,
    //providers: [Page]
})
export class ProductComponent /*extends PageBaseComponent*/ {

    model = {
        title           : "Денчик",
        backgroundColor : "material-red",
        productImgUrl   : "Images//BA.jpg",
        mainText        : "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.",
        subText         : "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра."
    }

    /*constructor(page: Page) {
        super(page);

        let details = JSON.parse(page.details);

        this.title           = details.title;
        this.backgroundColor = details.backgroundColor;
        this.productImgUrl   = details.productImgUrl;
        this.productImgAlt   = details.productImgAlt;
        this.mainText        = details.mainText;
        this.subText         = details.subText;
    }*/

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

   
}