import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouterModule } from "@angular/router";
import { LocalStorageStore, SessionStorageStore } from "@ku/auth";
import { ClipboardModule } from "ngx-clipboard";

import { KuUIModule } from "@ku/ui";
// region: third libs
import { NgZorroAntdModule } from "ng-zorro-antd";
import { Template1Component } from "@shared/loading/template/template1/template1.component";
import { Template2Component } from "@shared/loading/template/template2/template2.component";
import { Template3Component } from "@shared/loading/template/template3/template3.component";
import { DirectivesModule } from "./directive/index";

import {
    MenuService,
    SettingsService,
    TitleService,
    _HttpClient
} from "@ku/ui";
import { ACLService } from "@ku/auth";
import { KuModule } from "../ku.module";

const THIRDMODULES = [NgZorroAntdModule, KuUIModule, ClipboardModule];
// endregion

// region: your componets & directives
const COMPONENTS = [];
const SERVICES = [
    MenuService,
    SettingsService,
    TitleService,
    _HttpClient,
    LocalStorageStore,
    SessionStorageStore,
    ACLService
];
const DYNAMIC = [Template1Component, Template2Component, Template3Component];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,

        // third libs
        ...THIRDMODULES,
        KuModule.forRoot(),

        DirectivesModule
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DYNAMIC
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        DirectivesModule
    ],
    providers: [...SERVICES],
    entryComponents: [...DYNAMIC]
})
export class SharedModule {}
