import { Component, Output } from '@angular/core';
import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'my-gallery',
    styleUrls: ['./gallery.component.css'],
    templateUrl: './gallery.component.html'
})
export class GalleryComponent extends PageBaseComponent {
    public title = "Галерея продуктов";
    public backgroundColorClass = "material-blue";
    public ImgUrl = "Images//BA.jpg";
    public sometext = "Some text about project"
}