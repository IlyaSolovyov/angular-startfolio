import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";

@Component({
    selector: 'my-person',
    styleUrls: ['./person.component.css'],
    templateUrl: './person.component.html'
})
export class PersonComponent implements OnInit {
    _page: Page;
    model = {
        title:           'Вердикт',          
        backgroundColor: 'material-indigo',
        personImgUrl:    'Images//SO.jpg',
        opinion:         'Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.',       
        Name:            'Папа',           
        Surname:         'Пежа',        
        Age:             '69',            
        WhoIsThis:       'Папа Пежа'      
    }

  

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.personImgUrl = details.personImgUrl;
            this.model.opinion = details.opinion;
            this.model.Name = details.name;
            this.model.Surname = details.surname;
            this.model.Age = details.age;
            this.model.WhoIsThis = details.whoIsThis;
        }
    }

}

interface Details {
    title: string;
    backgroundColor: string;
    personImgUrl: string;
    opinion: string;
    name: string;
    surname: string;
    age: string;
    whoIsThis: string;
}