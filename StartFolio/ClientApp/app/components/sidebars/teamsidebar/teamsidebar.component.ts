import { Component } from '@angular/core';
import { Page } from '../../../page';
import { PageService } from '../../../services/page.service';

@Component({
    selector: 'my-teamsidebar',
    templateUrl: './teamsidebar.component.html',
    providers: [PageService]
})
export class TeamSidebarComponent {

    constructor(public page: Page, public pageService: PageService) {

    }

    editTextInfo(ev) {
        this.page.details = JSON.stringify(this.model);
        this.pageService.updateDetails(this.page.position, this.page.details);
    }

    model = {
        title: '',
        mainText: '',
        backgroundColor: '',

        teammate1_Name: '',
        teammate1_Description: '',
        teammate1_Link: '',
        teammate1_Photo: {},

        teammate2_Name: '',
        teammate2_Description: '',
        teammate2_Link: '',
        teammate2_Photo: {},
    }

    updateImage(ev, index) {
        var image = ev.target.files[0];

        switch (index) {
            case 1:
                this.model.teammate1_Photo = image;
                break;
            case 2:
                this.model.teammate2_Photo = image;
                break;
        }
    }
}
