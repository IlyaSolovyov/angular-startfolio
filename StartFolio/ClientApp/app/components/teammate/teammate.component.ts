import { Component, Output, Input } from '@angular/core';
import { PageService } from '../../services/page.service';

@Component({
    selector: 'teammate',
    styleUrls: ['./teammate.component.css'],
    templateUrl: './teammate.component.html'
})
export class TeammateComponent {
    @Input() name: string;
    @Input() photo: string;
    @Input() description: string;
    @Input() profileLink: string;

    /*constructor(pageService: PageService) {
        pageService.getPage()
            .subscribe()
    }*/

    /*public teammates_Name = "Ilya Solovyov";
    public teammates_Photo = "Images//SO.jpg";
    public teammates_Description = "make oXXXymiron great again...";
    public teammates_Profile = "GitHub profile";*/
}