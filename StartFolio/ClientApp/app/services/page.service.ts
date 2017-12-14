import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Page } from "../page";

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

    updateDetails(position: number, details: string) {
        return this.http.put('api/Page/' + position + "/Details", details);
    }

    updatePosition(position: number)
    {
        return this.http.delete('api/Page/' + position + "/Details");
    }

}