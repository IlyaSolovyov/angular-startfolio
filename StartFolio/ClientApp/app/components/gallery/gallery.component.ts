import { Component, Output } from '@angular/core';
import { Page } from '../../page';
import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-gallery',
    styleUrls: ['./gallery.component.css'],
    templateUrl: './gallery.component.html'
})
export class GalleryComponent extends PageBaseComponent {

    constructor(page: Page) {
        super(page);

        let details = JSON.parse(page.details);

        this.title              = details.title;
        this.backgroundColor    = details.backgroundColor;
        this.ImgUrl             = details.ImgUrl;
        this.sometext           = details.sometext;

    }

    public title            = "Галерея продуктов";
    public backgroundColor  = "material-blue";
    public ImgUrl           = "Images//BA.jpg";
    public sometext         = "Some text about project"
}