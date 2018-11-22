import {
    NgModule,
    Optional,
    SkipSelf,
    ModuleWithProviders
} from "@angular/core";
import { environment } from "@env/environment";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { RouteReuseStrategy } from "@angular/router";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { KuUIModule } from "@ku/ui";
import { KuAuthModule, JWTInterceptor, DelonAuthConfig } from "@ku/auth";
export function delonAuthConfig(): DelonAuthConfig {
    return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
        server_url: environment.SERVER_URL,
        auth_header: "Basic Y2xpZW50SWQ6c2VjcmV0"
    });
}

@NgModule({
    imports: [HttpClientModule, KuAuthModule.forRoot()],
    providers: [
        // 相应的HTTP拦截器
        { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
    ]
})
export class KuModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: KuModule
    ) {}

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: KuModule,
            providers: [
                { provide: DelonAuthConfig, useFactory: delonAuthConfig }
            ]
        };
    }
}
