import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Page } from "../page";
import { Headers } from '@angular/http';

@Injectable()
export class PageService {

    constructor(private http: Http) { }

    getPages(): Observable<Page[]> {
        return this.http.get('api/Page/')
            .map(response => {
                return response.json()
                    .results
                    .map(page => {
                        return new Page(
                            page.id,
                            page.position,
                            page.pageTemplate,
                            page.details
                    );
                })
            });
    }

    getPage(position: number) {
        return this.http.get('api/Page/' + position)
            .map(response => response.json());
    }

    addPage(page : Page)
    {
        return this.http.post('api/Page', page);
    }

    updateDetails(position: number, formData: string) {
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        let options = new RequestOptions({headers: headers});
        return this.http.put('api/Page/' + position + "/Details", formData, options);
    }

    updatePosition(position: number)
    {
        return this.http.delete('api/Page/' + position + "/Details");
    }

}