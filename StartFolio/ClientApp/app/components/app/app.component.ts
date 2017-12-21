import { Component, HostListener, Directive, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Page } from '../../page';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    pages: Observable<Page[]>;
    page: string = "no response yet";
    constructor(public pageService: PageService) {
    }

    ngOnInit() {
        this.getAction();
        console.log(this.page);
    }

    getAction() {
        let result: string ;
        this.pageService.getPage(0)
            .subscribe((page: Page) => {
                this.page = page.details;
                console.log("Fetched a page: " +this.page)//<-- not undefined anymore
            });
    }

    displayData(data: string)
    {
     console.log(this.page);
    }

}
