import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-gallerysidebar',
    templateUrl: './gallerysidebar.component.html'
})
export class GallerySidebarComponent {

    public galleryEditForm: FormGroup;

    //инициализация формы
    ngOnInit() {
        this.galleryEditForm = new FormGroup({
            title: new FormControl('', [<any>Validators.required]),
            backgroundColor: new FormControl('', [<any>Validators.required]),
            imgUrl1: new FormControl('', [<any>Validators.required]),
            imgUrl2: new FormControl('', [<any>Validators.required]),
            imgUrl3: new FormControl('', [<any>Validators.required]),
            description1: new FormControl('', [<any>Validators.required]),
            description2: new FormControl('', [<any>Validators.required]),
            description3: new FormControl('', [<any>Validators.required]),
        });
    }

    model = {
        title: '',
        backgroundColor: '',
        imgUrl1: {},
        imgUrl2: {},
        imgUrl3: {},
        description1: '',
        description2: '',
        description3: ''
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
                    this.model.imgUrl1 = reader.result;
                    break;
                case 2:
                    this.model.imgUrl2 = reader.result;
                    break;
                case 3:
                    this.model.imgUrl3 = reader.result;
                    break;
            }
        }
        reader.readAsDataURL(file);
    }

    save(data: Details) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title = data.title;
        this.model.description1 = data.description1;
        this.model.description2 = data.description2;
        this.model.description3 = data.description3;
        this.model.backgroundColor = data.backgroundColor;

        //ready to be sent to server
        let details = JSON.stringify(this.model);

    }
}

interface Details {
    title: string;
    backgroundColor: string;
    imgUrl1: any;
    imgUrl2: any;
    imgUrl3: any;
    description1: string;
    description2: string;
    description3: string;
}