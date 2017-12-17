import { Component } from '@angular/core';

@Component({
    selector: 'my-productsidebar',
    templateUrl: './productsidebar.component.html'
})
export class ProductSidebarComponent {

    /*constructor(public page: Page, public pageService: PageService) {

    }

    editProductInfo(ev) {
        this.page.details = JSON.stringify(this.model);
        this.pageService.updateDetails(this.page.position, this.page.details);
    }*/

    model = {
        title: '',
        mainText: '',
        subText: '',
        photo: {},
        backgroundColor: ''
    }

    updateImage(ev) {
        var image = ev.target.files[0];
        this.model.photo = image;
    }
}
