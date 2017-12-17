import { Component, HostListener, Directive, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Page } from '../../page';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [PageService]
})
export class AppComponent implements OnInit {
    pages: Observable<Page[]>;

    constructor(public pageService: PageService) {

    }

    ngOnInit() {
        this.pages = this.pageService.getPages();
    }


}
