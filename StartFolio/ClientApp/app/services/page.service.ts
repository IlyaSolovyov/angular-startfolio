import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import 'rxjs/add/operator/map';

@Injectable()
export class PageService {

    constructor(private http: Http) { }

    getPage(id: number) {
        return this.http.get(`api/Page/${id}`)
            .map(response => response.json());
    }

    updatePage() {

    }

}