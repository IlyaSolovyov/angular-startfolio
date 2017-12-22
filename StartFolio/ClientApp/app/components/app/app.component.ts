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
    count: number;
    isPages: boolean;
    snackMessage: string = "Component was succesfully updated!";

    constructor(public pageService: PageService, public editService: EditService) {
    }

    ngOnInit() {
        this.fetchPages();
        this.editService.updateNeeded.
            subscribe(result => this.updatePage(result));
    }

    updatePage(trigger: boolean) {
        console.log("There is a trigger change.");
        if (trigger == true) {
            console.log("We can fetch pages.");
            this.fetchPages();
        }
    }

    testUpdate() {
        this.editService.triggerUpdate();
    }

    fetchPage(position: number) {
        let result: string ;
        this.pageService.getPage(position)
            .subscribe((page: Page) => {
                this.page = page.details;
                console.log("Fetched a page, here are the details: " +this.page)
            });
    }

    fetchPages() {
        console.log("Starting slides download.");
        this.pageService.getPages()
            .subscribe((pages: Page[]) => {
                this.pages = pages;
                this.editService.setPagesCount(this.count = this.pages.length);

                if (this.pages && this.count > 0) {
                    this.isPages = true;
                } else {
                    this.isPages = false;
                }
            });
    }
}
