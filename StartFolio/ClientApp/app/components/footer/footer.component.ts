import { Component, Output } from '@angular/core';

@Component({
    selector: 'my-footer',
    styleUrls: ['./footer.component.css'],
    templateUrl: './footer.component.html'
})
export class FooterComponent {
    public title1 = "Address";
    public title2 = "Social networks";
    public title3 = "Contacts";

    public city    = "г. Одесса";
    public street  = "ул. Проспект Шевченко, 1ф";
    public zipCode = "65000";

    public vk_url = "https://vk.com";
    public fb_url = "https://facebook.com";
    public tg_url = "https://telegram.org";
    public tw_url = "https://twitter.com";
    public gp_url = "https://plus.google.com";


    public vk_icon = 'dist//icons//vk.svg';
    public fb_icon = 'dist//icons//fb.svg';
    public tg_icon = 'dist//icons//tg.svg';
    public tw_icon = 'dist//icons//tw.svg';
    public gp_icon = 'dist//icons//gp.svg';
    
    public phoneNumber = "+380123456789";
    public email       = "papa_peja322@opu.ua";
    public skype       = "solovyov909";
    public whatsApp    = "+380123456789";

    public tech = "1337-2017 Some technical info, copyrights, etc";

    public backgroundColorClass = "material-footer";
}