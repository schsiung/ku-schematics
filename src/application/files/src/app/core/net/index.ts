/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpRequest } from "@angular/common/http";
import { LoadingInterceptor } from "@core/net/loading-interceptor";

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
];
