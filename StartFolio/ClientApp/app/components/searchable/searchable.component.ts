import { Component, Input } from '@angular/core';

@Component({
    selector: 'searchable',
    templateUrl: './searchable.component.html',
    styleUrls: ['./searchable.component.css'],
})
export class SearchableComponent {
    @Input() previewLink: string;
    @Input() componentTitle: string;
}
