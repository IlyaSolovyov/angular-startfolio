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
            title:              'TextTitle',
            mainText:           'MainText',
            subText:            'SubText',
            backgroundColor:    '#ffffff',
            buttonLeftText:     'leftText',
            buttonRightText:    'rightText',
            buttonLeftLink:     'http://localhost/leftlink',
            buttonRightLink:    'http://localhost/rightlink'
        }

        this.teamDetails = {
            title:                  'TeamTitle',
            mainText:               'MainText',
            backgroundColor:        '#ffffff',
            teammate1_Name:         'DummyName1',
            teammate1_Description:  'DummyDescription1',
            teammate1_Link:         'https://localhost/firstLink',
            teammate1_Photo:        'dummy6.png',
            teammate2_Name:         'DummyName2',
            teammate2_Description:  'DummyDescription2',
            teammate2_Link:         'https://localhost/secondLink',
            teammate2_Photo:        'dummy7.png',
        }

        this.productDetails = {
            title:           'ProductTitle',
            mainText:        'MainText',
            subText:         'SubText',
            productImgUrl:           'dummy5.png',
            backgroundColor: '#ffffff'
        }

        this.personDetails = {
            title:           'PersonTitle',
            mainText:        'MainText',
            personName:      'DummyName',
            age:             '1337',
            position:        'PersonPosition',
            photo:           'dummy4.png',
            backgroundColor: '#ffffff'   
        }

        this.galleryDetails = {
            title:           'GalleryTitle',
            backgroundColor: '#ffffff',
            imgUrl1:         'dummy1.png',
            imgUrl2:         'dummy1.png',
            imgUrl3:         'dummy1.png',
            description1:    'Dummy description to project1',
            description2:    'Dummy description to project2',
            description3:    'Dummy description to project3'
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
