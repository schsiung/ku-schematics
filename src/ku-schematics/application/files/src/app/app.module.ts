import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    LOCALE_ID,
    APP_INITIALIZER,
    Injector
} from "@angular/core";
import {
    HttpClient,
    HTTP_INTERCEPTORS,
    HttpClientModule
} from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { AppComponent } from "./app.component";
import { RoutesModule } from "./routes/routes.module";
import { LayoutModule } from "./layout/layout.module";
import { StartupService } from "@core/startup/startup.service";
import { BlockUIModule } from "ng-block-ui";
import { Template4Component } from "@shared/loading/template/template4/template4.component";
// angular i18n
import { registerLocaleData } from "@angular/common";
import localeZhHans from "@angular/common/locales/zh-Hans";
import { httpInterceptorProviders } from "@core/net";
registerLocaleData(localeZhHans);
import {
    MenuService,
    SettingsService,
    TitleService,
    _HttpClient
} from "@ku/ui";
import "./utils/debug.util";
export function StartupServiceFactory(
    startupService: StartupService
): Function {
    return () => startupService.load();
}

const SERVICES = [MenuService, SettingsService, TitleService, _HttpClient];

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    declarations: [AppComponent, Template4Component],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        LayoutModule,
        RoutesModule,
        BlockUIModule.forRoot({
            message: "loading...",
            template: Template4Component
        })
    ],
    providers: [
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true
        },
        { provide: LOCALE_ID, useValue: "zh-Hans" },
        httpInterceptorProviders
    ],
    entryComponents: [Template4Component],
    bootstrap: [AppComponent]
})
export class AppModule {}
