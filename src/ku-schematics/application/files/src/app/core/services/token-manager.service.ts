import { Injectable, Injector, Optional } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import "@core/services/rxjs-operators";
import { Observable } from "rxjs/Observable";
import { SessionStorageStore } from "@ku/auth";
import { NzModalService } from "ng-zorro-antd";
import { catchError } from "rxjs/operators";

@Injectable()
export class TokenManagerService {
    private authHeader: string = "Basic Y2xpZW50SWQ6c2VjcmV0";
    private loginUrl: string = "/passport/login";

    constructor(
        private storageService: SessionStorageStore,
        private http: HttpClient,
        private router: Router,
        private modalService: NzModalService
    ) {}

    revokeAccessToken(): void {
        setTimeout(() => {
            this.modalService.closeAll();
            this.router.navigate([this.loginUrl]);
            window.sessionStorage.clear();
        }, 1000);
    }

    public getAccess(
        username: string,
        password: string,
        codeId?: string,
        verifyCode?: string
    ) {
        const headers = new HttpHeaders()
            .append("Authorization", this.authHeader)
            .append("Content-Type", "application/x-www-form-urlencoded");
        const body =
            "grant_type=password" +
            "&username=" +
            username +
            "&password=" +
            encodeURIComponent(password) +
            "&verifyCodeId=" +
            codeId +
            "&verifyCode=" +
            verifyCode;
        return this.http
            .post("/oauth/token", body, { headers: headers })
            .debug("用户登录")
            .map(res => {
                this.saveOAuthToken(res);
            });
    }

    public refreshToken() {
        const headers = new HttpHeaders()
            .append("Authorization", this.authHeader)
            .append("Content-Type", "application/x-www-form-urlencoded");
        const body =
            "grant_type=refresh_token" +
            "&refresh_token=" +
            this.authToken.refresh_token;
        return this.http
            .post("/oauth/token", body, { headers: headers })
            .map(res => {
                this.saveOAuthToken(res);

                return this.authToken.access_token;
            });
    }

    public getAuthToken() {
        return this.authToken ? this.authToken.access_token : null;
    }

    private saveOAuthToken(res: Object) {
        window.sessionStorage.setItem("AUTH_TOKEN", JSON.stringify(res));
    }

    private get authToken() {
        const token = window.sessionStorage.getItem("AUTH_TOKEN");
        return token ? JSON.parse(token) : null;
    }
}
