import { Component, Input } from '@angular/core';
import { Teammate } from './teammate'

@Component({
    selector: 'teammate-form',
    templateUrl: './teammate-form.component.html',
})
export class TeammateFormComponent {

    @Input() indexNo: number;
    
    constructor(public teammate: Teammate) {

    }

    updateImage(ev) {
        var image = ev.target.files[0];
        this.teammate.photo = image;
    }

}