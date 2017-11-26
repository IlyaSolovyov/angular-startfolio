import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-team',
    styleUrls: ['./team.component.css'],
    templateUrl: './team.component.html'
})
export class TeamComponent {
    public title = "Oi, mates!";
    public mainText = "Компания CоБа динамично развивается и растет с каждым годом. Сейчас в нашей семье работает около 1.75 квалифицированных разработчика. Ежеквартально все сотрудники компании проходят обязательную аттестацию для подтверждения или повышения своего квалификационного уровня, что также обеспечивает им карьерный рост и развитие. Мы активно работаем над совершенствованием наших коммуникативных, языковых и профессиональных навыков для обеспечения качественной обратной связи и взаимопонимания с клиентами. Большинство наших сотрудников владеют английским языком на высоком уровне. Мы любим персональное общение с клиентами и не только о работе! Двери компании СоБа всегда открыты для наших клиентов и гостей. Мы рады новым знакомствам и встречам. Приглашаем и вас познакомиться поближе с нашей командой!";
    public backgroundColorClass = "material-orange";

    public teammates_Name        = ["Ilya Solovyov", "Baghin Denis"];
    public teammates_Photo       = ["dist//SO.jpg", "dist//BA.jpg"];
    public teammates_Description = ["make oXXXymiron great again...", "make ui in luxoft..."];
    public button_text           = ["oXXXymiron", "meh..."];
}