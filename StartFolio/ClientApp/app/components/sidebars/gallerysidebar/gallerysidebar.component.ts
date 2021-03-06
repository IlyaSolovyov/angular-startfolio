﻿import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';
import { Page } from "../../../page";
import { PageService } from "../../../services/page.service";

@Component({
    selector: 'my-gallerysidebar',
    templateUrl: './gallerysidebar.component.html'
})
export class GallerySidebarComponent implements OnInit {

    public galleryEditForm: FormGroup;
    position: any;
    constructor(private editService: EditService, private pageService: PageService) { }

    //инициализация формы
    ngOnInit() {
        this.populateFormFromModel();
        this.editService.editablePage.
            subscribe(page => this.updateEditPage(page));

    }

    updateEditPage(page: Page) {
        if (page.pageTemplate == 'gallery-component') {
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
        this.galleryEditForm = new FormGroup({
            title:              new FormControl(this.model.title, [<any>Validators.required]),
            backgroundColor:    new FormControl(this.model.backgroundColor, [<any>Validators.required]),
            imgUrl1:            new FormControl('', [<any>Validators.required]),
            imgUrl2:            new FormControl('', [<any>Validators.required]),
            imgUrl3:            new FormControl('', [<any>Validators.required]),
            description1:       new FormControl(this.model.description1, [<any>Validators.required]),
            description2:       new FormControl(this.model.description2, [<any>Validators.required]),
            description3:       new FormControl(this.model.description3, [<any>Validators.required]),
        }); 
    }

    model: Details = {
        title:           '',
        backgroundColor: '',
        imgUrl1:         '',
        imgUrl2:         '',
        imgUrl3:         '',
        description1:    '',
        description2:    '',
        description3:    ''
    }

    imgFile1: any;
    imgFile2: any;
    imgFile3: any;

    updateImage(ev, index) {

        let file = ev.target.files[0];

            switch (index) {
                case 1:
                    this.model.imgUrl1 = file.name;
                    this.imgFile1 = file;
                    break;
                case 2:
                    this.model.imgUrl2 = file.name;
                    this.imgFile2 = file;
                    break;
                case 3:
                    this.model.imgUrl3 = file.name;
                    this.imgFile3 = file;
                    break;
            }
    }

    save(data: Details) {
        this.hideSidebar();

        //данные об изображении передаются в модель в updateImage()
        this.model.title            = data.title;
        this.model.description1     = data.description1;
        this.model.description2     = data.description2;
        this.model.description3     = data.description3;
        this.model.backgroundColor  = data.backgroundColor;

        //ready to be sent to server
        let details = JSON.stringify(this.model);
        console.log(details);

        let output = new FormData();
        output.append('details', details);
        if (this.imgFile1)
        {
            output.append('uploads', this.imgFile1, this.model.imgUrl1);
        }
        if (this.imgFile2) {
            output.append('uploads', this.imgFile2, this.model.imgUrl2);
        }
        if (this.imgFile3) {
            output.append('uploads', this.imgFile3, this.model.imgUrl3);
        }
        //alert(output.get('details'));
        this.pageService.updateDetails(this.position, output);
        this.editService.triggerUpdate();

    }

    hideSidebar() {
        let template = 'Gallery';
        (<HTMLInputElement>document.getElementById('show' + template + 'Sidebar')).checked = false;
        (<HTMLInputElement>document.getElementById('showSnackbar')).checked = true;
        setTimeout(() => { (<HTMLInputElement>document.getElementById('showSnackbar')).checked = false; }, 3000);
    }
}

interface Details {
    title:           string;
    backgroundColor: string;
    imgUrl1:         string;
    imgUrl2:         string;
    imgUrl3:         string;
    description1:    string;
    description2:    string;
    description3:    string;
}