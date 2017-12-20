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
    model = {
        title: 'Галерея продуктов',
        backgroundColor: 'material-blue',
        ImgUrl1: 'Images//BA.jpg',
        ImgUrl2: 'Images//SO.jpg',
        ImgUrl3: 'Images//SO.jpg',
        description1: 'BA text about project',
        description2: 'SO text about project',
        description3: 'SoBa text about project'
    };

    constructor(private editService: EditService) { }

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        this.position = -1;
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.ImgUrl1 = details.imgUrl1;
            this.model.ImgUrl2 = details.imgUrl2;
            this.model.ImgUrl3 = details.imgUrl3;
            this.model.description1 = details.description1;
            this.model.description2 = details.description2;
            this.model.description3 = details.description3;
            this.position = this._page.position;


        }

    }

    editPage() {
            this.editService.changeEditablePage(new Page(this.position, 'gallery-component', JSON.stringify(this.model)))
    }
}
interface Details
{
    title: string;
    backgroundColor: string;
    imgUrl1: string;
    imgUrl2: string;
    imgUrl3: string;
    description1: string;
    description2: string;
    description3: string;
}