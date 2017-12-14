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

    template0: string;
    template1: string;
    template2: string;
    template3: string;
    template4: string;
 

    constructor() {
        this.titles0 = 'Text component';
        this.previews0 = 'Images//previews//text.PNG';
        this.template0 = 'text-component'

        this.titles1 = 'Team component';
        this.previews1 = 'Images//previews//team.PNG';
        this.template0 = 'team-component'

        this.titles2 = 'Person component';
        this.previews2 = 'Images//previews//person.PNG';
        this.template0 = 'person-component'

        this.titles3 = 'Product component';
        this.previews3 = 'Images//previews//product.PNG';
        this.template0 = 'product-component'

        this.titles4 = 'Gallery component';
        this.previews4 = 'Images//previews//gallery.PNG';
        this.template0 = 'gallery-component'
    }

    /*createPage(string templateName)
    {

    }*/
}
