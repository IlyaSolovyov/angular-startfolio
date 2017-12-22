import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import 'rxjs/add/operator/map';

@Injectable()
export class AccountService {

    constructor(private http: Http) { }

    authenticate(password: string) {
        var body = `username=${password}`;
        var headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');

        /*this.http
                .post('localhost:57092/api/page', body, { headers: headers })
                .map(response => response.json())
                    .subscribe(
                    response => this.storeToken(response.id_token),
                    this.logError,
                    () => console.log('Authentication Complete')
                   );
        */
    }

    updatePage() {

    }

}