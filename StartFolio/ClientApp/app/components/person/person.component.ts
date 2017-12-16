import { Component, Output } from '@angular/core';
import { Page } from '../../page';
import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-person',
    styleUrls: ['./person.component.css'],
    templateUrl: './person.component.html',
    providers: [Page]
})
export class PersonComponent extends PageBaseComponent {

    constructor(page: Page) {
        super(page);

        let details = JSON.parse(page.details);

        this.title           = details.title;
        this.backgroundColor = details.backgroundColor;
        this.personImgUrl    = details.personImgUrl;
        this.personImgAlt    = details.personImgAlt;
        this.opinion         = details.opinion;
        this.Name            = details.Name;
        this.Surname         = details.Surname;
        this.Age             = details.Age;
        this.WhoIsThis       = details.WhoIsThis;
    }

    getBackgroundColor() {
        return this.backgroundColor;
    }

    public title            = "Вердикт";
    public backgroundColor  = "material-indigo";
    public personImgUrl     = "Images//SO.jpg";
    public personImgAlt     = "alternative content"; 
    public opinion          = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
    public Name             = "Папа";
    public Surname          = "Пежа";
    public Age              = "99";
    public WhoIsThis        = "Папа Пежа";
}