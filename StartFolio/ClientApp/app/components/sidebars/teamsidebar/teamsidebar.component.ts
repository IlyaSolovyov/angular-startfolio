import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-teamsidebar',
    templateUrl: './teamsidebar.component.html'
})
export class TeamSidebarComponent implements OnInit {

    public teamEditForm: FormGroup;

    //инициализация формы
    ngOnInit() {
        this.teamEditForm = new FormGroup({
            title:                  new FormControl('', [<any>Validators.required]),
            mainText:               new FormControl('', [<any>Validators.required]),
            backgroundColor:        new FormControl('', [<any>Validators.required]),
            teammate1_Name:         new FormControl('', [<any>Validators.required]),
            teammate1_Description:  new FormControl('', [<any>Validators.required]),
            teammate1_Link:         new FormControl('', [<any>Validators.required]),
            teammate1_Photo:        new FormControl('', [<any>Validators.required]),
            teammate2_Name:         new FormControl('', [<any>Validators.required]),
            teammate2_Description:  new FormControl('', [<any>Validators.required]),
            teammate2_Link:         new FormControl('', [<any>Validators.required]),
            teammate2_Photo:        new FormControl('', [<any>Validators.required]),
        });
    }

    model = {
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

    updateImage(ev, index) {
        let reader = new FileReader();
        //get the selected file from event
        let file = ev.target.files[0];

        //onloadend срабатывает после reader.readAsDataURL(file);
        reader.onloadend = () => {
            //Assign the result to variable for setting the src of image element

            switch (index) {
                case 1:
                    this.model.teammate1_Photo = reader.result;
                    break;
                case 2:
                    this.model.teammate2_Photo = reader.result;
                    break;
            }
        }
        reader.readAsDataURL(file);
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
