import { Component } from '@angular/core';

@Component({
    selector: 'my-textsidebar',
    templateUrl: './textsidebar.component.html',
    styleUrls: ['./textsidebar.component.css']
})
export class TextSidebarComponent {
    private _opened: boolean = true;

    private _toggleSidebar() {
        this._opened = !this._opened;
    }
}
