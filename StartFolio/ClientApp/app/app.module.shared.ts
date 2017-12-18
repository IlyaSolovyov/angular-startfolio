import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { TextComponent } from './components/text/text.component';
import { TeamComponent } from './components/team/team.component';
import { TeammateComponent } from './components/teammate/teammate.component';
import { FooterComponent } from './components/footer/footer.component';
import { FabComponent } from './fab/fab.component';
//import { Page } from './page';
import { TextSidebarComponent } from './components/sidebars/textsidebar/textsidebar.component';
import { TeamSidebarComponent } from './components/sidebars/teamsidebar/teamsidebar.component';
import { PersonSidebarComponent } from './components/sidebars/personsidebar/personsidebar.component';
import { ProductSidebarComponent } from './components/sidebars/productsidebar/productsidebar.component';
import { GallerySidebarComponent } from './components/sidebars/gallerysidebar/gallerysidebar.component';
import { SearchSidebarComponent } from './components/sidebars/searchsidebar/searchsidebar.component';
import { SearchableComponent } from './components/searchable/searchable.component';
import { PersonComponent } from './components/person/person.component';
import { ProductComponent } from './components/product/product.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LoginComponent } from './components/login/login.component';
import { DevButtonComponent } from './devbutton/devbutton.component';
import { EditButtonComponent } from './components/btns/editbtn/editbtn.component';
import { TrashButtonComponent } from './components/btns/trash-btn/trashbtn.component';
import { UpButtonComponent } from './components/btns/up-btn/upbtn.component';
import { DownButtonComponent } from './components/btns/down-btn/downbtn.component';
import { PageService } from "./services/page.service";
import { AccountService } from "./services/account.service";


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        TextComponent,
        TeamComponent,
        TeammateComponent,
        FooterComponent,
        FabComponent,
        PersonComponent,
        ProductComponent,
        TextSidebarComponent,
        TeamSidebarComponent,
        PersonSidebarComponent,
        ProductSidebarComponent,
        GallerySidebarComponent,
        SearchSidebarComponent,
        SearchableComponent,
        GalleryComponent,
        LoginComponent,
        DevButtonComponent,
        EditButtonComponent,
        TrashButtonComponent,
        UpButtonComponent,
        DownButtonComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: TextComponent },
            { path: 'text', component: TextComponent },
            { path: 'team', component: TeamComponent },
            { path: 'footer', component: FooterComponent },
            { path: 'person', component: PersonComponent },
            { path: 'product', component: ProductComponent },
            { path: '**', redirectTo: 'home' }
        ]
        )
    ],
    entryComponents: [
        GalleryComponent,
        TextComponent,
        PersonComponent,
        TeamComponent,
        ProductComponent
    ],
    providers: [
        PageService, AccountService
    ]
})
export class AppModuleShared {
}
