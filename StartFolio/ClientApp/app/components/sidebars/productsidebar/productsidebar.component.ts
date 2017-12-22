import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';
import { Page } from "../../../page";
import { PageService } from "../../../services/page.service";

@Component({
    selector: 'my-productsidebar',
    templateUrl: './productsidebar.component.html'
})
export class ProductSidebarComponent implements OnInit {

    public productEditForm: FormGroup;
    position: any;
    constructor(private editService: EditService, private pageService: PageService) { }

    //инициализация формы
    ngOnInit() {
        this.populateFormFromModel();
        this.editService.editablePage.
            subscribe(page => this.updateEditPage(page));
    }

    updateEditPage(page: Page) {
        if (page.pageTemplate == 'product-component') {
            //alert(JSON.stringify(page));
            this.fetchDataToModel(page.details)
            this.position = page.position;
            this.populateFormFromModel();
        }
    }

    fetchDataToModel(details: string) {
        this.model = JSON.parse(details);
    }

    populateFormFromModel() {
        //alert(this.model.title + " " + this.model.mainText + " " + this.model.subText + " " + this.model.photo + " " + this.model.backgroundColor);

        this.productEditForm = new FormGroup({
            title:           new FormControl(this.model.title, [<any>Validators.required]),
            mainText:        new FormControl(this.model.mainText, [<any>Validators.required]),
            subText:         new FormControl(this.model.subText, [<any>Validators.required]),
            productImgUrl:   new FormControl('', [<any>Validators.required]),
            backgroundColor: new FormControl(this.model.backgroundColor, [<any>Validators.required])
        });
    }

    model: Details = {
        title:              '',
        mainText:           '',
        subText:            '',
        productImgUrl:      '',
        backgroundColor:    ''
    }

    imageFile: any;

    updateImage(ev) {
        let file = ev.target.files[0];
        this.model.productImgUrl = file.name;
        this.imageFile = file;
    }

    save(data: Details) {
        this.hideSidebar();

        //данные об изображении передаются в модель в updateImage()
        this.model.title            = data.title;
        this.model.mainText         = data.mainText;
        this.model.subText          = data.subText;
        this.model.backgroundColor  = data.backgroundColor;

        //ready to be sent to server
        let details = JSON.stringify(this.model);
        console.log(details);;

        let output = new FormData();
        output.append('details', details);
        output.append('uploads', this.imageFile);
        this.pageService.updateDetails(this.position, output);
    }


    hideSidebar() {
        let template = 'Product';
        (<HTMLInputElement>document.getElementById('show' + template + 'Sidebar')).checked = false;
        (<HTMLInputElement>document.getElementById('showSnackbar')).checked = true;
        setTimeout(() => { (<HTMLInputElement>document.getElementById('showSnackbar')).checked = false; }, 3000);
    }
}

interface Details {
    title:              string,
    mainText:           string,
    subText:            string,
    productImgUrl:      string,
    backgroundColor:    string
}
