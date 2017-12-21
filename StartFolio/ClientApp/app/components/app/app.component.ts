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
    page: string = "Didn't fetch yet.";
    constructor(public pageService: PageService) {
    }

    ngOnInit() {
        this.fetchPages();
        //console.log(this.page);
    }

    fetchPage(position: number) {
        let result: string ;
        this.pageService.getPage(position)
            .subscribe((page: Page) => {
                this.page = page.details;
                console.log("Fetched a page, here are the details: " +this.page)//<-- not undefined anymore
            });
    }

    fetchPages() {
        let result: string;
        this.pageService.getPages()
            .subscribe((response: string) => {
                console.log("Fetched pages: " + response)//<-- not undefined anymore
            });
    }

    displayData(data: string)
    {
     //console.log(this.page);
    }

}
