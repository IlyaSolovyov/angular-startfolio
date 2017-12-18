import { Component, Output, Inject, forwardRef, Injectable } from '@angular/core';
import { Page } from "../../page";

@Component({
    selector: 'my-text',
    styleUrls: [ './text.component.css' ],
    templateUrl: './text.component.html'
})
export class TextComponent {
    _page: Page;
    model = {
        title            : "Some text theme",
        mainText         : "Проснувшись однажды утром после беспокойного сна, Грегор Замза обнаружил, что он у себя в постели превратился в страшное насекомое. Лежа на панцирнотвердой спине, он видел, стоило ему приподнять голову, свой коричневый, выпуклый, разделенный дугообразными чешуйками живот, на верхушке которого еле держалось готовое вот-вот окончательно сползти одеяло. Его многочисленные, убого тонкие по сравнению с остальным телом ножки беспомощно копошились у него перед глазами. «Что со мной случилось?» – подумал он. Это не было сном. Его комната, настоящая, разве что слишком маленькая, но обычная комната, мирно покоилась в своих четырех хорошо знакомых стенах. Над столом, где были разложены распакованные образцы сукон – Замза был коммивояжером, – висел портрет, который он недавно вырезал из иллюстрированного журнала и вставил в красивую золоченую рамку. На портрете была изображена дама в меховой шляпе и боа, она сидела очень прямо и протягивала зрителю тяжелую меховую муфту, в которой целиком исчезала ее рука. Затем взгляд Грегора устремился в окно, и пасмурная погода – слышно было, как по жести подоконника стучат капли дождя – привела его и вовсе в грустное настроение. «Хорошо бы еще немного поспать и забыть всю эту чепуху», – подумал он, но это было совершенно неосуществимо, он привык спать на правом боку, а в теперешнем своем",
        subText          : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        buttonLeftText   : "button1",
        buttonRightText  : "button2",
        buttonLeftLink   : "www.pornhub.com",
        buttonRightLink  : "opu.ua",
        backgroundColor  : "material-blue"
    }


    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.mainText = details.mainText;
            this.model.subText = details.subText;
            this.model.buttonLeftText = details.buttonLeftText;
            this.model.buttonLeftLink = details.buttonLeftLink;
            this.model.buttonRightText = details.buttonRightText;
            this.model.buttonRightLink = details.buttonRightLink;
        }
    }

}

interface Details {
    title: string;
    backgroundColor: string;
    mainText: string;
    subText: string;
    buttonLeftText: string;
    buttonLeftLink: string;
    buttonRightText: string;
    buttonRightLink: string;
}