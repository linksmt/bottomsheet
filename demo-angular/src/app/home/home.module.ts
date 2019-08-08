import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { ContentComponent } from "../content/content.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule
    ],
    declarations: [
        HomeComponent,
        ContentComponent
    ],
    exports: [ContentComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [ContentComponent]
})
export class HomeModule { }
