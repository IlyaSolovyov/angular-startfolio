import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";
import { EditService } from "../../services/edit.service";

@Component({
    selector: 'my-person',
    styleUrls: ['./person.component.css'],
    templateUrl: './person.component.html'
})
export class PersonComponent implements OnInit {
    _page: Page;
    position: number;
    model: Details = {
        title:           'Вердикт',          
        backgroundColor: 'material-indigo',
        photo:    'Images//SO.jpg',
        mainText:         'Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.',       
        personName:       'Папа Пежа',
        age:             '69',            
        position:       'Папа Пежа'      
    }

    constructor(private editService: EditService) { }

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        this.position = -1;
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.photo = details.photo;
            this.model.mainText = details.mainText;
            this.model.personName = details.personName;
            this.model.age = details.age;
            this.model.position = details.position;
        }
    }

    editPage() {
        this.editService.changeEditablePage(new Page(this.position, 'person-component', JSON.stringify(this.model)))
    }

}

interface Details {
    title: string,
    mainText: string,
    personName: string,
    age: string,
    position: string,
    photo: string,
    backgroundColor: string
}