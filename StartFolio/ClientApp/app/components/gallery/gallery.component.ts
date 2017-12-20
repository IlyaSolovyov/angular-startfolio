import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";
import { EditService } from "../../services/edit.service";

@Component({
    selector: 'my-gallery',
    styleUrls: ['./gallery.component.css'],
    templateUrl: './gallery.component.html'
})
export class GalleryComponent implements OnInit {
    _page: Page;
    position: number;
    model: Details = {
        title:           'Галерея продуктов',
        backgroundColor: 'material-blue',
        imgUrl1:         'Images//BA.jpg',
        imgUrl2:         'Images//SO.jpg',
        imgUrl3:         'Images//SO.jpg',
        description1:    'BA text about project',
        description2:    'SO text about project',
        description3:    'SoBa text about project'
    };

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

            /*this.model.title            = details.title;
            this.model.backgroundColor  = details.backgroundColor;
            this.model.imgUrl1          = details.imgUrl1;
            this.model.imgUrl2          = details.imgUrl2;
            this.model.imgUrl3          = details.imgUrl3;
            this.model.description1     = details.description1;
            this.model.description2     = details.description2;
            this.model.description3     = details.description3;*/
        }

    }

    editPage() {
            this.editService.changeEditablePage(new Page(this.position, 'gallery-component', JSON.stringify(this.model)))
    }
}
interface Details
{
    title:              string;
    backgroundColor:    string;
    imgUrl1:            string;
    imgUrl2:            string;
    imgUrl3:            string;
    description1:       string;
    description2:       string;
    description3:       string;
}