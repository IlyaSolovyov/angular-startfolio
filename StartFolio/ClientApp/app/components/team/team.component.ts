import { Component, Output } from '@angular/core';

@Component({
    styleUrls: ['./team.component.css'],
    templateUrl: './team.component.html'
})
export class TeamComponent {
    public title = "Oi, mates!";
    public mainText = "Компания CоБа динамично развивается и растет с каждым годом. Сейчас в нашей семье работает около 1.75 квалифицированных разработчика. Ежеквартально все сотрудники компании проходят обязательную аттестацию для подтверждения или повышения своего квалификационного уровня, что также обеспечивает им карьерный рост и развитие. Мы активно работаем над совершенствованием наших коммуникативных, языковых и профессиональных навыков для обеспечения качественной обратной связи и взаимопонимания с клиентами. Большинство наших сотрудников владеют английским языком на высоком уровне. Мы любим персональное общение с клиентами и не только о работе! Двери компании СоБа всегда открыты для наших клиентов и гостей. Мы рады новым знакомствам и встречам. Приглашаем и вас познакомиться поближе с нашей командой!";
    public backgroundColorClass = "material-orange";

    public SO_title = "Ilya Solovyov";
    public BA_title = "Baghin Denis";
    public photoSO = "card-image--SO";
    public photoBA = "card-image--BA";
    public SO_text = "make oXXXymiron great again...";
    public BA_text = "make ui in luxoft...";
}