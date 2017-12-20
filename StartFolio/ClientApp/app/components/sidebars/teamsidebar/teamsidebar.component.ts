import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';
import { Page } from "../../../page";

@Component({
    selector: 'my-teamsidebar',
    templateUrl: './teamsidebar.component.html'
})
export class TeamSidebarComponent implements OnInit {

    public teamEditForm: FormGroup;
    page: Page;
    constructor(private editService: EditService) { }

    //инициализация формы
    ngOnInit() {
        this.populateFormFromModel();
        this.editService.editablePage.
            subscribe(page => this.updateEditPage(page));
    }

    updateEditPage(page: Page) {
        if (page.pageTemplate == 'team-component') {
            //alert(JSON.stringify(page));
            this.fetchDataToModel(page.details)
            this.populateFormFromModel();
        }
    }

    fetchDataToModel(details: string) {
        this.model = JSON.parse(details);
    }

    populateFormFromModel() {
        
        this.teamEditForm = new FormGroup({
            title:                  new FormControl(this.model.title, [<any>Validators.required]),
            mainText:               new FormControl(this.model.mainText, [<any>Validators.required]),
            backgroundColor:        new FormControl(this.model.backgroundColor, [<any>Validators.required]),

            teammate1_Name:         new FormControl(this.model.teammate1_Name, [<any>Validators.required]),
            teammate1_Description:  new FormControl(this.model.teammate1_Description, [<any>Validators.required]),
            teammate1_Link:         new FormControl(this.model.teammate1_Link, [<any>Validators.required]),
            teammate1_Photo:        new FormControl('', [<any>Validators.required]),

            teammate2_Name:         new FormControl(this.model.teammate2_Name, [<any>Validators.required]),
            teammate2_Description:  new FormControl(this.model.teammate2_Description, [<any>Validators.required]),
            teammate2_Link:         new FormControl(this.model.teammate2_Link, [<any>Validators.required]),
            teammate2_Photo:        new FormControl('', [<any>Validators.required]),
        });
    }

    model: Details = {
        title:                  '',
        mainText:               '',
        backgroundColor:        '',

        teammate1_Name:         '',
        teammate1_Description:  '',
        teammate1_Link:         '',
        teammate1_Photo:        '',

        teammate2_Name:         '',
        teammate2_Description:  '',
        teammate2_Link:         '',
        teammate2_Photo:        '',
    }

    imgFile1: any;
    imgFile2: any;

    updateImage(ev, index) {
        let file = ev.target.files[0];

        switch (index) {
            case 1:
                this.model.teammate1_Photo = file.name;
                this.imgFile1 = file;
                break;
            case 2:
                this.model.teammate2_Photo = file.name;
                this.imgFile2 = file;
                break;
        }
    }

    save(data: Details) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title                 = data.title;
        this.model.mainText              = data.mainText;
        this.model.backgroundColor       = data.backgroundColor;

        this.model.teammate1_Name        = data.teammate1_Name;
        this.model.teammate1_Description = data.teammate1_Description;
        this.model.teammate1_Link        = data.teammate1_Link;
        this.model.teammate2_Name        = data.teammate2_Name;
        this.model.teammate2_Description = data.teammate2_Description;
        this.model.teammate2_Link        = data.teammate2_Link;

        //ready to be sent to server
        let details = JSON.stringify(this.model);
        console.log(details);

        let output = new FormData();
        output.append('details', details);

        if (this.imgFile1) {
            output.append('uploads', this.imgFile1);
        }
        if (this.imgFile2) {
            output.append('uploads', this.imgFile2);
        }
    }

}

interface Details {
    title:                  string,
    mainText:               string,
    backgroundColor:        string,

    teammate1_Name:         string,
    teammate1_Description:  string,
    teammate1_Link:         string,
    teammate1_Photo:        string,

    teammate2_Name:         string,
    teammate2_Description:  string,
    teammate2_Link:         string,
    teammate2_Photo:        string,
}
