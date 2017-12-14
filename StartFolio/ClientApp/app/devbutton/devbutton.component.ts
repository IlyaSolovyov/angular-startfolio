import { Component, HostListener, Directive } from '@angular/core';



@Component({
    selector: 'devbutton',
    styleUrls: ['./devbutton.component.css'],
    templateUrl: './devbutton.component.html'
})
export class DevButtonComponent {
    @HostListener("window:scroll", [])
    onScroll(): void {
        let devButton = document.getElementById("devButton");
        if (devButton != null) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                devButton.classList.remove("hidden-devBtn");
                devButton.classList.add("visible-devBtn");
            } else {
                devButton.classList.remove("visible-devBtn");
                devButton.classList.add("hidden-devBtn");
            }
        }
    }

    testClick() {

    }
    /*@HostListener("window:scroll", ["$event"])
    onWindowScroll() {
        
        //In chrome and some browser scroll is given to body tag
        

        let magicOffset = 662;

        let pos = (document.documentElement.scrollTop || document.body.scrollTop) + magicOffset;
        let bottom = document.documentElement.offsetHeight;

        let devButton = document.getElementById("devButton");

        if (devButton != null) {
            if (pos == bottom) {
                devButton.classList.remove("hidden-devBtn");
                devButton.classList.add("visible-devBtn");
            } else {
                devButton.classList.remove("visible-devBtn");
                devButton.classList.add("hidden-devBtn");
            }
        }*/
 }
