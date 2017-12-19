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

    updateImage(ev) {
        let reader = new FileReader();
        //get the selected file from event
        let file = ev.target.files[0];

        //onloadend срабатывает после reader.readAsDataURL(file);
        reader.onloadend = () => {
            //Assign the result to variable for setting the src of image element
            this.model.photo = reader.result;
        }
        reader.readAsDataURL(file);
    }

    save(data: Details) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title            = data.title;
        this.model.mainText         = data.mainText;
        this.model.subText          = data.subText;
        this.model.backgroundColor  = data.backgroundColor;

        //ready to be sent to server
        let details = JSON.stringify(this.model);

        //console.log(details);
    }
}

interface Details {
    title:              string,
    mainText:           string,
    subText:            string,
    photo:              string,
    backgroundColor:    string
}
