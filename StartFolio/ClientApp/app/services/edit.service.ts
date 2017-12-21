import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Page } from "../page";

@Injectable()
export class EditService {

    private editSource = new BehaviorSubject<Page>(new Page(-1, 'unloaded-page', 'no details'));
    private pagesCountSource = new BehaviorSubject<number>(0);

    editablePage = this.editSource.asObservable();
    pagesCount = this.pagesCountSource.asObservable();
    constructor() { };

    changeEditablePage(page: Page) {
        this.editSource.next(page);
    }

    setPagesCount(count: number){
        this.pagesCountSource.next(count);
        console.log("Слайдов загружено: " + this.pagesCountSource.value)
    }

    increasePagesCount() {

        this.pagesCountSource.next(this.pagesCountSource.value + 1);
        console.log("Слайдов теперь " + this.pagesCountSource.value)
    }
}