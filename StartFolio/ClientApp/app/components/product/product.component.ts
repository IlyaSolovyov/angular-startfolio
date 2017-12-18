import { Component, Output } from '@angular/core';
import { Page } from "../../page";

@Component({
    selector: 'my-product',
    styleUrls: ['./product.component.css'],
    templateUrl: './product.component.html'
})
export class ProductComponent {
    _page: Page;
    model = {
        title           : "Денчик",
        backgroundColor : "material-red",
        productImgUrl   : "Images//BA.jpg",
        mainText        : "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.",
        subText         : "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра."
    }


    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.productImgUrl = details.productImgUrl;
            this.model.mainText = details.mainText;
            this.model.subText = details.subText;
        }
    }

}

interface Details {
    title: string;
    backgroundColor: string;
    productImgUrl: string;
    mainText: string;
    subText: string;
}