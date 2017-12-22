import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { Page } from "../page";
import { Headers } from '@angular/http';
import 'rxjs/add/operator/catch';
import { EditService } from "./edit.service";

@Injectable()
export class PageService {

    constructor(private http: Http, private editService: EditService) { }

    
    getPages() {
        this.editService.confirmUpdate();
        return this.http.get('/api/Page/')
            .map((res) => res.json());      
        
    }

    getPage(position: number) {
        return this.http.get('api/Page/' + position)
            .map((res) => res.json())
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

        this.http.post('http://localhost:57092/api/Page', formData, options)
            .map(res => res.json()) // ...and calling .json() on the response to return data
            .subscribe(event => this.editService.triggerUpdate());
    }

    updateDetails(position: number, formData: FormData) { 
        let newFormData = new FormData();
        newFormData.append('details', formData.get('details'));
        newFormData.append('uploads', formData.get('uploads'));
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        
        this.http.put('api/Page/' + position + "/Details", formData, options)
            .map(res => res.json()) // ...and calling .json() on the response to return data
            .subscribe(event => this.editService.triggerUpdate());
    }

    updatePosition(position: number, direction: number) {
        let formData = new FormData();
        formData.append('newPosition', (position + direction).toString());
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        this.http.put('api/Page/' + position + "/Position", formData, options)
            .map(res => res.json()) // ...and calling .json() on the response to return data
            .subscribe(event => this.editService.triggerUpdate());
    }

    deletePage(position: number)
    {
        this.http.delete('api/Page/' + position)
            .map(res => res.json()) // ...and calling .json() on the response to return data
            .subscribe(event => this.editService.triggerUpdate());
    };
    
}