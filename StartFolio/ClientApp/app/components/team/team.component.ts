import { Component, Output, OnInit} from '@angular/core';
import { Page } from "../../page";
import { EditService } from "../../services/edit.service";

@Component({
    selector: 'my-team',
    styleUrls: ['./team.component.css'],
    templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {
    _page: Page;
    position: number;
    model: Details = {
        title:                  "Oi, mates!",
        mainText:               "Компания CоБа динамично развивается и растет с каждым годом. Сейчас в нашей семье работает около 1.75 квалифицированных разработчика. Ежеквартально все сотрудники компании проходят обязательную аттестацию для подтверждения или повышения своего квалификационного уровня, что также обеспечивает им карьерный рост и развитие. Мы активно работаем над совершенствованием наших коммуникативных, языковых и профессиональных навыков для обеспечения качественной обратной связи и взаимопонимания с клиентами. Большинство наших сотрудников владеют английским языком на высоком уровне. Мы любим персональное общение с клиентами и не только о работе! Двери компании СоБа всегда открыты для наших клиентов и гостей. Мы рады новым знакомствам и встречам. Приглашаем и вас познакомиться поближе с нашей командой!",
        backgroundColor:        "material-orange",

        teammate1_Name:         'Ilya Solovyov',
        teammate1_Description:  'Images//SO.jpg',
        teammate1_Link:         'make oXXXymiron great again...',
        teammate1_Photo:        'https://github.com/IlyaSolovyov',
                 
        teammate2_Name:         'Baghin Denis',
        teammate2_Description:  'Images//BA.jpg',
        teammate2_Link:         'make ui in luxoft...',
        teammate2_Photo:        'https://github.com/Denis1697'
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

            this.model.stName = details.stName;
            this.model.stPhoto = details.stPhoto;
            this.model.stDesc = details.stDesc;
            this.model.stLink = details.stLink;

            this.model.ndName = details.ndName;
            this.model.ndPhoto = details.ndPhoto;
            this.model.ndDesc = details.ndDesc;
            this.model.ndLink = details.ndLink;*/
        }
    }

    editPage() {
        this.editService.changeEditablePage(new Page(this.position, 'team-component', JSON.stringify(this.model)))
    }

}

interface Details {
    title:              string;
    mainText:           string;
    backgroundColor:    string;

    teammate1_Name:         string,
    teammate1_Description:  string,
    teammate1_Link:         string,
    teammate1_Photo:        string,

    teammate2_Name:         string,
    teammate2_Description:  string,
    teammate2_Link:         string,
    teammate2_Photo:        string,
}