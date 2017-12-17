import { Component } from '@angular/core';

@Component({
    selector: 'my-gallerysidebar',
    templateUrl: './gallerysidebar.component.html'
})
export class GallerySidebarComponent {

    model = {
        title: '',
        backgroundColor: '',
        photos: []
    }

    /*constructor(public page: Page, public pageService: PageService) {

    }

    editGalleryInfo(ev) {
        this.page.details = JSON.stringify(this.model);
        this.pageService.updateDetails(this.page.position, this.page.details);
    }*/


    updateImage(ev, index) {
        var image = ev.target.files[0];
        this.model.photos[index] = image;
    }
}
