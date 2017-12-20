import { Page } from "../../page";

export abstract class PageBaseComponent {
    _page: Page;

    constructor(page: Page) {
        this._page = page;
    }

    getId() {
        return this._page.id;
    }

    getPageTemplate() {
        return this._page.pageTemplate;
    }

    getPosition() {
        return this._page.position;
    }

    getDetails() {
        return this._page.details;
    }
}
