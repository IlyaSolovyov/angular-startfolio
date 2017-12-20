import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";
import { EditService } from "../../services/edit.service";

@Component({
    selector: 'my-product',
    styleUrls: ['./product.component.css'],
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
    _page: Page;
    position: number;
    model: Details = {
        title           : "Денчик",
        backgroundColor : "material-red",
        productImgUrl   : "Images//BA.jpg",
        mainText        : "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.",
        subText         : "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра."
    }

    constructor(private editService: EditService) { }

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        this.position = -1;
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);

            this.model = details;
            this.position = this._page.position;

            /*this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.productImgUrl = details.productImgUrl;
            this.model.mainText = details.mainText;
            this.model.subText = details.subText;*/
        }
    }

    editPage() {
        this.editService.changeEditablePage(new Page(this.position, 'product-component', JSON.stringify(this.model)))
    }

}

interface Details {
    title:              string;
    backgroundColor:    string;
    productImgUrl:      string;
    mainText:           string;
    subText:            string;
}