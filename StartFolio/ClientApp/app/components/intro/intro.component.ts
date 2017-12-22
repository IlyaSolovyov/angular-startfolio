import { Component, Output, OnInit } from '@angular/core';

@Component({
    selector: 'intro',
    styleUrls: ['./intro.component.css'],
    templateUrl: './intro.component.html'
})
export class IntroComponent {
    model: Details = {
        title:              'Ваш сайт пока еще пуст!',
        mainText:           'Добавьте контент на сайт с помощью кнопки "Добавить" в нижнем правом углу. Выберите компонент, который вам приглянулся и редактируйте его содержимое, как вашей душе угодно!',
        backgroundColor:    '#0E9D57'
    }

    getBackgroundColor() {
        return this.model.backgroundColor;
    }
}
interface Details {
    title:              string;
    mainText:           string;
    backgroundColor:    string;
}