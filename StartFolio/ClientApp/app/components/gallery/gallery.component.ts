import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-gallery',
    styleUrls: ['./gallery.component.css'],
    templateUrl: './gallery.component.html'
})
export class GalleryComponent {

    model = {
        title:           'Галерея продуктов',
        backgroundColor: 'material-blue',
        ImgUrl:          'Images//BA.jpg',
        sometext:        'Some text about project'
    };
    
    getBackgroundColor() {
        return this.model.backgroundColor;
    }
}