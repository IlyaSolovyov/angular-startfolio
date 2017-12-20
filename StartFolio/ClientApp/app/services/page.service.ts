import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { Page } from "../page";
import { Headers } from '@angular/http';
import 'rxjs/add/operator/catch';

@Injectable()
export class PageService {

    constructor(private http: Http) { }

    

    getPages() {
        return this.http.get('localhost:57092/api/Page/')
            .map((res: Response) => res.json());      
    }


    getPage(position: number) {
        return this.http.get('api/Page/' + position)
            .map(response => response.json());
    }

    addPage(page : Page)
    {
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

        let formData = new FormData();
        formData.append('position', page.position.toString());
        formData.append('pagetemplate', page.pageTemplate);
        formData.append('details', page.details);

        return this.http.post('/api/Page', formData, options)
                        .map(res => res.json()) // ...and calling .json() on the response to return data
                        .subscribe();

    }

    updateDetails(position: number, formData: string) {
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        let options = new RequestOptions({headers: headers});
        return this.http.put('api/Page/' + position + "/Details", formData, options);
    }

    deletePage(position: number)
    {
        return this.http.delete('api/Page/' + position + "/Details");
    }

}