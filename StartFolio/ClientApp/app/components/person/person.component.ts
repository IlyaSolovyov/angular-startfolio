import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";
import { EditService } from "../../services/edit.service";
import { PageService } from "../../services/page.service";

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
        photo:           'SO.jpg',
        mainText:        'Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.',       
        personName:      'Папа Пежа',
        age:             '69',            
        position:        'Папа Пежа'      
    }

    getImagePath(imageName: string): string {
        let img = 'Images//' + imageName;
        return img;
    }

    constructor(private editService: EditService, private pageService: PageService) { }

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        this.position = -1;
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model = details;
            this.position = this._page.position;

        }
    }

    editPage() {
        this.editService.changeEditablePage(new Page(this.position, 'person-component', JSON.stringify(this.model)))
    }

    updatePosition(position: number, direction: number) {
        console.log("Пытаемся поменять слайд " + position + " со слайдом " + (position + direction));
        this.pageService.updatePosition(position, direction);
    }

    deletePage() {
        let willDelete = confirm("Do you really want to delete this component?");

        if (!willDelete) {
            return;
        }

        this.pageService.deletePage(this.position);
    }

}

interface Details {
    title:           string,
    mainText:        string,
    personName:      string,
    age:             string,
    position:        string,
    photo:           string,
    backgroundColor: string
}