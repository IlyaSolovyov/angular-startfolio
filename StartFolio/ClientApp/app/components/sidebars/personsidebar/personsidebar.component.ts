import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-personsidebar',
    templateUrl: './personsidebar.component.html'
})
export class PersonSidebarComponent implements OnInit {

    public personEditForm: FormGroup;

    //инициализация формы
    ngOnInit() {
        this.personEditForm = new FormGroup({
            title:           new FormControl('', [<any>Validators.required]),
            backgroundColor: new FormControl('', [<any>Validators.required]),
            mainText:        new FormControl('', [<any>Validators.required]),
            personName:      new FormControl('', [<any>Validators.required]),
            age:             new FormControl(0,  [<any>Validators.required]),
            position:        new FormControl('', [<any>Validators.required]),
            photo:           new FormControl('', [<any>Validators.required])
        });
    }

    model = {
        title:              '',
        mainText:           '',
        personName:         '',
        age:                0,
        position:           '',
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
        this.model.title           = data.title;
        this.model.mainText        = data.mainText;
        this.model.personName      = data.personName;
        this.model.position        = data.position;
        this.model.age             = data.age;
        this.model.backgroundColor = data.backgroundColor;

        //ready to be sent to server
        let details = JSON.stringify(this.model);
        console.log(details);
    }
}

interface Details {
    title:           string,
    mainText:        string,
    personName:      string,
    age:             number,
    position:        string,
    photo:           string,
    backgroundColor: string   
}