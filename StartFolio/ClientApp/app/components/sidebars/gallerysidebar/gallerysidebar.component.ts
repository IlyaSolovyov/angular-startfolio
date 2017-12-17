import { Component } from '@angular/core';
import { PageService } from '../../../services/page.service';
import { Page } from '../../../page';

@Component({
    selector: 'my-gallerysidebar',
    templateUrl: './gallerysidebar.component.html',
    providers: [PageService]
})
export class GallerySidebarComponent {

    constructor(public page: Page, public pageService: PageService) {

    }

    editGalleryInfo(ev) {
        this.page.details = JSON.stringify(this.model);
        this.pageService.updateDetails(this.page.position, this.page.details);
    }

    model = {
        title: '',
        backgroundColor: '',
        photos: []
    }

    updateImage(ev, index) {
        var image = ev.target.files[0];
        this.model.photos[index] = image;
    }
}
