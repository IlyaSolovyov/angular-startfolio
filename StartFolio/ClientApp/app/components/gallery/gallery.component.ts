import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";
import { EditService } from "../../services/edit.service";
import { PageService } from "../../services/page.service";

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
        imgUrl1:         'BA.jpg',
        imgUrl2:         'SO.jpg',
        imgUrl3:         'SO.jpg',
        description1:    'BA text about project',
        description2:    'SO text about project',
        description3:    'SoBa text about project'
    };

    getImagePath(imageName: string): string {
        let img = 'Images//' + imageName;
        return img;
    }

    constructor(private editService: EditService, private pageService: PageService) { }

    getBackgroundColor() {
        return this.model.backgroundColor;
    }

    ngOnInit() {
        this.position = -1;
        if (this._page) {
            let details: Details = JSON.parse(this._page.details);
            this.model = details;
            this.position = this._page.position;
        }

    }

    editPage() {
            this.editService.changeEditablePage(new Page(this.position, 'gallery-component', JSON.stringify(this.model)))
    }

    updatePosition(position: number, direction: number) {
        console.log("Пытаемся поменять слайд " + position + " со слайдом " + (position + direction));
        this.pageService.updatePosition(position, direction);
    }

    deletePage()
    {
        this.pageService.deletePage(this.position);
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