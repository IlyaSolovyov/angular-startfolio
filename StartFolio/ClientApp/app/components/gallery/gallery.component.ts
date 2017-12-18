import { Component, Output, OnInit } from '@angular/core';
import { Page } from "../../page";

@Component({
    selector: 'my-gallery',
    styleUrls: ['./gallery.component.css'],
    templateUrl: './gallery.component.html'
})
export class GalleryComponent  implements OnInit{
    _page: Page;
    model = {
        title:           'Галерея продуктов',
        backgroundColor: 'material-blue',
        ImgUrl:          'Images//BA.jpg',
        sometext:        'Some text about project'
    };
    
    getBackgroundColor() {
      return this.model.backgroundColor;
    }

    ngOnInit()
    {
        if (this._page)
        {
            let details: Details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.ImgUrl = details.imgUrl;
            this.model.sometext = details.description;
        }       
    }

}

interface Details
{
    title: string;
    backgroundColor: string;
    imgUrl: string;
    description: string;
}