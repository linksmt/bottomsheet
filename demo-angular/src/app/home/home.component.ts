import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { BottomSheetService, BottomSheetOptions } from 'nativescript-bottomsheet/angular';
import { ContentComponent } from '../content/content.component';

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    constructor(
        private bottomSheet: BottomSheetService, 
        private containerRef: ViewContainerRef,
    ) {
        
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    showOptions() {
        const options: BottomSheetOptions = {
            viewContainerRef: this.containerRef,
            context: ['Facebook', 'Google', 'Twitter']
        };
        
        this.bottomSheet
        .show(ContentComponent, options)
        .subscribe(result => {
            console.log('Option selected:', result);
        });
    }
}
