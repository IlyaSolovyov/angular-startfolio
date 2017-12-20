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
        teammate1_Description:  'make oXXXymiron great again...',
        teammate1_Link:         'https://github.com/IlyaSolovyov',
        teammate1_Photo:        'SO.jpg',
                 
        teammate2_Name:         'Baghin Denis',
        teammate2_Description:  'make ui in luxoft...',
        teammate2_Link:         'https://github.com/Denis1697',
        teammate2_Photo:        'BA.jpg'
    }

    getImagePath(imageName: string):string {
        let img = 'Images//' + imageName;
        return img;
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