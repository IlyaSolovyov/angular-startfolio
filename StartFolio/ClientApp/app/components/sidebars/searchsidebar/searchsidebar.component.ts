import { Component } from '@angular/core';

@Component({
    selector: 'my-searchsidebar',
    templateUrl: './searchsidebar.component.html',
})
export class SearchSidebarComponent {
    previews0: string;
    titles0: string;
    previews1: string;
    titles1: string;
    previews2: string;
    titles2: string;
    previews3: string;
    titles3: string;
    previews4: string;
    titles4: string;

    constructor() {
        this.titles0 = 'Text component';
        this.previews0 = 'Images//previews//text.PNG';

        this.titles1 = 'Team component';
        this.previews1 = 'Images//previews//team.PNG';

        this.titles2 = 'Person component';
        this.previews2 = 'Images//previews//person.PNG';

        this.titles3 = 'Product component';
        this.previews3 = 'Images//previews//product.PNG';

        this.titles4 = 'Gallery component';
        this.previews4 = 'Images//previews//gallery.PNG';
    }
}
