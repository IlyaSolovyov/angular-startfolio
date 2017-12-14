import { Component, Output } from '@angular/core';
import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-person',
    styleUrls: ['./person.component.css'],
    templateUrl: './person.component.html'
})
export class PersonComponent extends PageBaseComponent {
    public title = "Вердикт";
    public backgroundColorClass = "material-indigo";
    public personImgUrl = "Images//SO.jpg";
    public personImgAlt = "alternative content"; 
    public opinion = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
    public Name = "Папа";
    public Surname = "Пежа";
    public Age = "99";
    public WhoIsThis = "Папа Пежа";
}