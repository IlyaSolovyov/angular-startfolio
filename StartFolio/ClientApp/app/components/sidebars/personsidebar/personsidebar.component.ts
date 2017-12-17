﻿import { Component } from '@angular/core';
import { Page } from '../../../page';
import { PageService } from '../../../services/page.service';

@Component({
    selector: 'my-personsidebar',
    templateUrl: './personsidebar.component.html',
    providers: [PageService]
})
export class PersonSidebarComponent {

    constructor(public page: Page, public pageService: PageService) {

    }

    editPersonInfo(ev) {
        this.page.details = JSON.stringify(this.model);
        this.pageService.updateDetails(this.page.position, this.page.details);
    }

    model = {
        title: '',
        mainText: '',
        personName: '',
        age: 0,
        position: '',
        photo: {},
        backgroundColor: ''        
    }

    updateImage(ev) {
        var image = ev.target.files[0];
        this.model.photo = image;
    }
}
