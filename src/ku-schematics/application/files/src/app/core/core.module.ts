import { NgModule, Optional, SkipSelf } from "@angular/core";
import { throwIfAlreadyLoaded } from "@core/module-import-guard";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

// import { DefaultInterceptor } from './net/default.interceptor';

import { AppSettingService } from "@core/services/settings.service";
import { StorageService } from "@core/services/storage.service";
import { AuthGuard } from "@core/services/auth-guard.service";
import { AuthUserService } from "@core/services/auth-user.service";
import { TokenManagerService } from "@core/services/token-manager.service";

const SERVICES = [
    TokenManagerService,
    AuthUserService,
    AuthGuard,
    AppSettingService,
    StorageService
];
@NgModule({
    providers: [
        ...SERVICES
        // { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }
    ]
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
    ) {
        throwIfAlreadyLoaded(parentModule, "CoreModule");
    }
}
