﻿import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';
import { Page } from "../../../page";

@Component({
    selector: 'my-textsidebar',
    templateUrl: './textsidebar.component.html'
})
export class TextSidebarComponent implements OnInit {

    public textEditForm: FormGroup;
    page: Page;
    constructor(private editService: EditService) { }

    //инициализация формы
    ngOnInit() {
        this.populateFormFromModel();
        this.editService.editablePage.
            subscribe(page => this.updateEditPage(page));
    }

    updateEditPage(page: Page) {
        if (page.pageTemplate == 'text-component') {
            alert(JSON.stringify(page));
            this.fetchDataToModel(page.details)
            this.populateFormFromModel();
        }
    }

    fetchDataToModel(details: string) {
        this.model = JSON.parse(details);
    }

    populateFormFromModel() {
        this.textEditForm = new FormGroup({
            title:              new FormControl(this.model.title, [<any>Validators.required]),
            mainText:           new FormControl(this.model.mainText, [<any>Validators.required]),
            subText:            new FormControl(this.model.subText, [<any>Validators.required]),
            backgroundColor:    new FormControl(this.model.backgroundColor, [<any>Validators.required]),
            buttonLeftLink:     new FormControl(this.model.buttonLeftLink, [<any>Validators.required]),
            buttonRightLink:    new FormControl(this.model.buttonRightLink, [<any>Validators.required]),
            buttonLeftText:     new FormControl(this.model.buttonLeftText, [<any>Validators.required]),
            buttonRightText:    new FormControl(this.model.buttonRightText, [<any>Validators.required])
        });
    }

    model: Details = {
        title:              '',
        mainText:           '',
        subText:            '',
        backgroundColor:    '',
        buttonLeftLink:     '',
        buttonRightLink:    '',
        buttonLeftText:     '',
        buttonRightText:    ''
    }

    save(data: Details) {
        this.model = data;
        
        let details = JSON.stringify(this.model);
        console.log(details);

        let output = new FormData();
        output.append('details', details);
    }

}

interface Details {
    title:              string,
    mainText:           string,
    subText:            string,
    backgroundColor:    string,
    buttonLeftLink:     string,
    buttonRightLink:    string,
    buttonLeftText:     string,
    buttonRightText:    string
}
