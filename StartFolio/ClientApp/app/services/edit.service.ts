import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Page } from "../page";

@Injectable()
export class EditService {

    private editSource = new BehaviorSubject<Page>(new Page(-1, 'unloaded-page', 'no details'));

    editablePage = this.editSource.asObservable();

    constructor() { };

    changeEditablePage(page: Page) {
        this.editSource.next(page);
  
    }
}