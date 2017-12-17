import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-team',
    styleUrls: ['./team.component.css'],
    templateUrl: './team.component.html'
})
export class TeamComponent {

    model = {
        title:           "Oi, mates!",
        mainText:        "Компания CоБа динамично развивается и растет с каждым годом. Сейчас в нашей семье работает около 1.75 квалифицированных разработчика. Ежеквартально все сотрудники компании проходят обязательную аттестацию для подтверждения или повышения своего квалификационного уровня, что также обеспечивает им карьерный рост и развитие. Мы активно работаем над совершенствованием наших коммуникативных, языковых и профессиональных навыков для обеспечения качественной обратной связи и взаимопонимания с клиентами. Большинство наших сотрудников владеют английским языком на высоком уровне. Мы любим персональное общение с клиентами и не только о работе! Двери компании СоБа всегда открыты для наших клиентов и гостей. Мы рады новым знакомствам и встречам. Приглашаем и вас познакомиться поближе с нашей командой!",
        backgroundColor: "material-orange",
        stName:          'Ilya Solovyov',
        stPhoto:         'Images//SO.jpg',
        stDesc:          'make oXXXymiron great again...',
        stLink:          'https://github.com/IlyaSolovyov',
                         
        ndName:          'Baghin Denis',
        ndPhoto:         'Images//BA.jpg',
        ndDesc:          'make ui in luxoft...',
        ndLink:          'https://github.com/Denis1697'
    }
    
    /*constructor(page: Page) {
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

        this.title              = details.title;
        this.mainText           = details.mainText;
        this.backgroundColor    = details.backgroundColor;
    }*/

    getBackgroundColor() {
        return this.model.backgroundColor;
    }
    
    
}