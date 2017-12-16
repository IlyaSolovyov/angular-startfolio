import { Component, Output } from '@angular/core';
import { PageBaseComponent } from "../pagebase/pagebase.component";
import { Page } from '../../page';



@Component({
    selector: 'my-team',
    styleUrls: ['./team.component.css'],
    templateUrl: './team.component.html',
    providers: [Page]
})
export class TeamComponent extends PageBaseComponent {
    private stName:  string;
    private stPhoto: string;
    private stDesc:  string;
    private stLink:  string;

    private ndName:  string;
    private ndPhoto: string;
    private ndDesc:  string;
    private ndLink:  string;

    constructor(page: Page) {
        super(page);

        let details = JSON.parse(page.details);

        this.stName  = details.stName;
        this.stPhoto = details.stPhoto;
        this.stDesc  = details.stDesc;
        this.stLink  = details.stLink;

        this.ndName  = details.ndName;
        this.ndPhoto = details.ndPhoto;
        this.ndDesc  = details.ndDesc;
        this.ndLink  = details.ndLink;

        /*this.stName = 'Ilya Solovyov';
        this.stPhoto = 'Images//SO.jpg';
        this.stDesc = 'make oXXXymiron great again...';
        this.stLink = 'https://github.com/IlyaSolovyov';
        
        this.ndName = 'Baghin Denis';
        this.ndPhoto = 'Images//BA.jpg';
        this.ndDesc = 'make ui in luxoft...';
        this.ndLink = 'https://github.com/Denis1697';*/

        this.title              = details.title;
        this.mainText           = details.mainText;
        this.backgroundColor    = details.backgroundColor;
    }

    getBackgroundColor() {
        return this.backgroundColor;
    }
    
    private title           = "Oi, mates!";
    private mainText        = "Компания CоБа динамично развивается и растет с каждым годом. Сейчас в нашей семье работает около 1.75 квалифицированных разработчика. Ежеквартально все сотрудники компании проходят обязательную аттестацию для подтверждения или повышения своего квалификационного уровня, что также обеспечивает им карьерный рост и развитие. Мы активно работаем над совершенствованием наших коммуникативных, языковых и профессиональных навыков для обеспечения качественной обратной связи и взаимопонимания с клиентами. Большинство наших сотрудников владеют английским языком на высоком уровне. Мы любим персональное общение с клиентами и не только о работе! Двери компании СоБа всегда открыты для наших клиентов и гостей. Мы рады новым знакомствам и встречам. Приглашаем и вас познакомиться поближе с нашей командой!";
    private backgroundColor = "material-orange";
}