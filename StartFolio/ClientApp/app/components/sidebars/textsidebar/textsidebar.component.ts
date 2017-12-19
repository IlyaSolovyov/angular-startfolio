import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-textsidebar',
    templateUrl: './textsidebar.component.html'
})
export class TextSidebarComponent implements OnInit {

    public textEditForm: FormGroup;

    //инициализация формы
    ngOnInit() {
        this.textEditForm = new FormGroup({
            title:              new FormControl('', [<any>Validators.required]),
            mainText:           new FormControl('', [<any>Validators.required]),
            subText:            new FormControl('', [<any>Validators.required]),
            backgroundColor:    new FormControl('', [<any>Validators.required]),
            buttonLeftLink:     new FormControl('', [<any>Validators.required]),
            buttonRightLink:    new FormControl('', [<any>Validators.required]),
            buttonLeftText:     new FormControl('', [<any>Validators.required]),
            buttonRightText:    new FormControl('', [<any>Validators.required])
        });
    }

    model = {
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

        //ready to be sent to server
        let details = JSON.stringify(this.model);
        console.log(details);

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
