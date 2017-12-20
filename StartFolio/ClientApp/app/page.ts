import { Injectable } from '@angular/core';

@Injectable()
export class Page {
    

    constructor(
        public position: number,
        public pageTemplate: string,
        public details: string,
        public id?: number) {
    }
}