import { Component, Output, Input, ViewContainerRef, ViewChild, OnDestroy, OnInit, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Page } from "../../page";
import { TextComponent } from "../text/text.component";
import { TeamComponent } from "../team/team.component";
import { PersonComponent } from "../person/person.component";
import { GalleryComponent } from "../gallery/gallery.component";
import { ProductComponent } from "../product/product.component";
import { PageBaseComponent } from "../pagebase/pagebase.component";

@Component({
    selector: 'dynamic-content',
    template: `
        <div>
            <div #container></div>
        </div>
    `
})
export class DynamicComponent implements OnInit, OnDestroy  {

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    @Input()
    type: string;
    page: Page;

    private mappings = {
        'text-component': TextComponent,
        'team-component': TeamComponent,
        'person-component': PersonComponent,
        'product-component': ProductComponent,
        'gallery-component': GalleryComponent
    };

    private componentRef: ComponentRef<{}>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver) {
    }

    getComponentType(typeName: string) {
        let type = this.mappings[typeName];
        return type;
    }

    ngOnInit() {
        if (this.type) {
            let componentType = this.getComponentType(this.type);

            // note: componentType must be declared within module.entryComponents
            let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            this.componentRef = this.container.createComponent(factory);

            // set component context
            let instance = <PageBaseComponent>this.componentRef.instance;
            instance.page = this.page;
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}