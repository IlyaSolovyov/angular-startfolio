import { Component, OnInit } from '@angular/core';
import { Page } from '../../../page';
import { PageService } from '../../../services/page.service';
import { EditService } from "../../../services/edit.service";

@Component({
    selector: 'my-searchsidebar',
    templateUrl: './searchsidebar.component.html',
    providers: [PageService]
})
export class SearchSidebarComponent implements OnInit {
    titles0: string;
    titles1: string;
    titles2: string;
    titles3: string;
    titles4: string;

    previews0: string;
    previews1: string;
    previews2: string;
    previews3: string;
    previews4: string;

    template0: string;
    template1: string;
    template2: string;
    template3: string;
    template4: string;

    textDetails:    any;
    teamDetails:    any;
    productDetails: any;
    personDetails:  any;
    galleryDetails: any;

    pagesArray: Page[];

    constructor(public pageService: PageService, public editService: EditService) {
    }

    ngOnInit() {
        this.titles0    = 'Text component';
        this.previews0  = 'Images//previews//text.PNG';
        this.template0  = 'text-component'

        this.titles1    = 'Team component';
        this.previews1  = 'Images//previews//team.PNG';
        this.template1  = 'team-component'

        this.titles2    = 'Person component';
        this.previews2  = 'Images//previews//person.PNG';
        this.template2  = 'person-component'

        this.titles3    = 'Product component';
        this.previews3  = 'Images//previews//product.PNG';
        this.template3  = 'product-component'

        this.titles4    = 'Gallery component';
        this.previews4  = 'Images//previews//gallery.PNG';
        this.template4  = 'gallery-component'

        this.textDetails = {
            title:              'Ваш заголовок текстового компонента',
            mainText:           'Основной текст, который вы вставите',
            subText:            'Дополнительный текст, который вы вставите',
            backgroundColor:    '#47A7F5',
            buttonLeftText:     'Текст кнопки1',
            buttonRightText:    'Текст кнопки2',
            buttonLeftLink:     'http://вашассылкаккнопке1.com',
            buttonRightLink:    'http://вашассылкаккнопке2.com'
        }

        this.teamDetails = {
            title:                  'Заголовок компонента команды',
            mainText:               'Основной текст, описывающий вашу команду',
            backgroundColor:        '#FCD837',
            teammate1_Name:         'Имя Фамилия вашего 1-го сокомандника',
            teammate1_Description:  'Краткое описание вашего 1-го сокомандника',
            teammate1_Link:         'https://ссылканапрофильвашегосокомандника1.com',
            teammate1_Photo:        'dummy6.png',
            teammate2_Name:         'Имя Фамилия вашего 2-го сокомандника',
            teammate2_Description:  'Краткое описание вашего 2-го сокомандника',
            teammate2_Link:         'https://ссылканапрофильвашегосокомандника2.com',
            teammate2_Photo:        'dummy7.png',
        }

        this.productDetails = {
            title:           'Заголовок компонента продукта',
            mainText:        'Основной текст, описывающий ваш продукт или проект',
            subText:         'Дополнительный текст, описывающий ваш продукт или проект',
            productImgUrl:   'dummy5.png',
            backgroundColor: '#7986CB'
        }

        this.personDetails = {
            title:           'Заголовок компонента персоны',
            mainText:        'Текст, выражающий мнение персоны',
            personName:      'Имя Фамилия персоны',
            age:             '25',
            position:        'Должность или статус персоны',
            photo:           'dummy4.png',
            backgroundColor: '#B3E5FC'   
        }

        this.galleryDetails = {
            title:           'Заголовок компонента галереи',
            backgroundColor: '#E53935',
            imgUrl1:         'dummy1.png',
            imgUrl2:         'dummy1.png',
            imgUrl3:         'dummy1.png',
            description1:    'Описание 1й фотографии вашей галереи',
            description2:    'Описание 2й фотографии вашей галереи',
            description3:    'Описание 3й фотографии вашей галереи'
        }

    }

    createPage(template: string)
    {
   /*     this.pageService.getPages()
            .subscribe(
            resultArray => this.pagesArray = resultArray,
            error => console.log("Error :: " + error)
        )*/

      

        let position = -1;
        this.editService.pagesCount.
            subscribe(count => position=count);
        let details = '';
        position = position + 1;
        switch (template) {
            case 'text-component':
                details = this.textDetails;
                break;
            case 'team-component':
                details = this.teamDetails;
                break;
            case 'person-component':
                details = this.personDetails;
                break;
            case 'product-component':
                details = this.productDetails;
                break;
            case 'gallery-component':
                details = this.galleryDetails;
                break;
        }

        var page = new Page(position, template, JSON.stringify(details));
        this.pageService.addPage(page);
        this.editService.increasePagesCount()
        alert("Succesfully added new " + template + " to your web-site!");
    }
}
