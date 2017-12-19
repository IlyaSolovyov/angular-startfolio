import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'my-productsidebar',
    templateUrl: './productsidebar.component.html'
})
export class ProductSidebarComponent implements OnInit {

    public productEditForm: FormGroup;

    //инициализация формы
    ngOnInit() {
        this.productEditForm = new FormGroup({
            title:           new FormControl('', [<any>Validators.required]),
            mainText:        new FormControl('', [<any>Validators.required]),
            subText:         new FormControl('', [<any>Validators.required]),
            photo:           new FormControl('', [<any>Validators.required]),
            backgroundColor: new FormControl('', [<any>Validators.required])
        });
    }

    model = {
        title:              '',
        mainText:           '',
        subText:            '',
        photo:              '',
        backgroundColor:    ''
    }

    imageFile: any;

    updateImage(ev) {
        let file = ev.target.files[0];
        this.model.photo = file.name;
        this.imageFile = file;
    }

    save(data: Details) {
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
    }
}

interface Details {
    title:              string,
    mainText:           string,
    subText:            string,
    photo:              string,
    backgroundColor:    string
}
