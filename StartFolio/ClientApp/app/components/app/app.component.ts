import { Component, HostListener, Directive, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Page } from '../../page';
import { Observable } from 'rxjs/Observable';
import { EditService } from "../../services/edit.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    pages: Page[];
    pageJsons: string[];
    page: string = "Didn't fetch yet.";
    constructor(public pageService: PageService, public editService: EditService) {
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
            .subscribe((pages: Page[]) => {
                this.pages = pages;
                //console.log("Fetched pages count: " + this.pages.length);//<-- not undefined anymore
                //console.log("First page: " + JSON.stringify(this.pages[0]));
                this.editService.setPagesCount(this.pages.length);
            });
    }

    displayData(data: string)
    {
     //console.log(this.page);
    }

}
