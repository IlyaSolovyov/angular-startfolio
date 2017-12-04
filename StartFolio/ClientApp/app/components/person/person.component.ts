import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-person',
    styleUrls: ['./person.component.css'],
    templateUrl: './person.component.html'
})
export class PersonComponent {
    public title = "Вердикт";
    public backgroundColorClass = "material-indigo";
    public personImgUrl = "dist//SO.jpg";
    public personImgAlt = "alternative content"; 
    public opinion = "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.";
    public Name = "Папа";
    public Surname = "Пежа";
    public Age = "99";
    public WhoIsThis = "Папа Пежа";
}