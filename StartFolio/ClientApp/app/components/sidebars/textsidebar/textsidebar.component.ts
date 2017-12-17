import { Component } from '@angular/core';

@Component({
    selector: 'my-textsidebar',
    templateUrl: './textsidebar.component.html'
})
export class TextSidebarComponent {

    /*constructor(public page: Page, public pageService: PageService) {
    
    }

    editTextInfo(ev) {
        this.page.details = JSON.stringify(this.model);
        this.pageService.updateDetails(this.page.position, this.page.details);
    }*/

    model = {
        title: '',
        mainText: '',
        subText: '',
        backgroundColor: ''
    }

}
