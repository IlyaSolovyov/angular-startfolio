import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';
import { Page } from "../../../page";

@Component({
    selector: 'my-personsidebar',
    templateUrl: './personsidebar.component.html'
})
export class PersonSidebarComponent implements OnInit {

    public personEditForm: FormGroup;
    page: Page;
    constructor(private editService: EditService) { }

    //инициализация формы
    ngOnInit() {
        this.populateFormFromModel();   
        this.editService.editablePage.
            subscribe(page => this.updateEditPage(page));
    }

    updateEditPage(page: Page) {
        if (page.pageTemplate == 'person-component'){
            alert(JSON.stringify(page));
            this.fetchDataToModel(page.details)
            this.populateFormFromModel();
        }    
    }

    fetchDataToModel(details: string) {
        this.model = JSON.parse(details);
    }

    populateFormFromModel() {
        alert(this.model.title + " " + this.model.mainText + " " + this.model.personName + " " + this.model.age + " " + this.model.position + " " + this.model.photo + " " + this.model.backgroundColor );
        this.personEditForm = new FormGroup({
            title: new FormControl(this.model.title, [<any>Validators.required]),
            backgroundColor: new FormControl(this.model.backgroundColor, [<any>Validators.required]),
            mainText: new FormControl(this.model.mainText, [<any>Validators.required]),
            personName: new FormControl(this.model.personName, [<any>Validators.required]),
            age: new FormControl(this.model.age, [<any>Validators.required]),
            position: new FormControl(this.model.position, [<any>Validators.required]),
            photo: new FormControl(this.model.photo, [<any>Validators.required])
        });
    }


    model: Details = {
        title:              '',
        mainText:           '',
        personName:         '',
        age:                '',
        position:           '',
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
        this.model.title           = data.title;
        this.model.mainText        = data.mainText;
        this.model.personName      = data.personName;
        this.model.position        = data.position;
        this.model.age             = data.age;
        this.model.backgroundColor = data.backgroundColor;

        //ready to be sent to server
        let details = JSON.stringify(this.model);
        console.log(details);

        let output = new FormData();
        output.append('details', details);
        output.append('uploads', this.imageFile);
 
    }
}

interface Details {
    title:           string,
    mainText:        string,
    personName:      string,
    age:             string,
    position:        string,
    photo:           string,
    backgroundColor: string   
}