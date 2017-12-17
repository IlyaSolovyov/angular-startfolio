import { Component, Output } from '@angular/core';
//import { Page } from '../../page';
//import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-gallery',
    styleUrls: ['./gallery.component.css'],
    templateUrl: './gallery.component.html'//,
    //providers: [Page]
})
export class GalleryComponent /*extends PageBaseComponent*/ {

    model = {
        title:           'Галерея продуктов',
        backgroundColor: 'material-blue',
        ImgUrl:          'Images//BA.jpg',
        sometext:        'Some text about project'
    };

    /*constructor(page: Page) {
        super(page);

        let details = JSON.parse(page.details);

        this.title              = details.title;
        this.backgroundColor    = details.backgroundColor;
        this.ImgUrl             = details.ImgUrl;
        this.sometext           = details.sometext;

    }*/
    getBackgroundColor() {
        return this.model.backgroundColor;
    }
}