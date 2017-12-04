import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { TextComponent } from './components/text/text.component';
import { TeamComponent } from './components/team/team.component';
import { FooterComponent } from './components/footer/footer.component';
import { FabComponent } from './fab/fab.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PersonComponent } from './components/person/person.component';
import { ProductComponent } from './components/product/product.component';


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        TextComponent,
        TeamComponent,
        FooterComponent,
        FabComponent,
        PersonComponent,
        ProductComponent,
        SidebarComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: '',             redirectTo: 'home', pathMatch: 'full' },
            { path: 'home',         component: TextComponent },
            { path: 'counter',      component: CounterComponent },
            { path: 'fetch-data',   component: FetchDataComponent },
            { path: 'text',         component: TextComponent },
            { path: 'team',         component: TeamComponent },
            { path: 'footer',       component: FooterComponent },
            { path: 'person',       component: PersonComponent },
            { path: 'product',      component: ProductComponent },
            { path: '**',           redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
