import { Injectable } from '@angular/core';

@Injectable()
export class Page {
    constructor(public id: number,
        public position: number,
        public pageTemplate: string,
        public details: string) {
    }
}