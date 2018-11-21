import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { ACLService, SessionStorageStore } from "@ku/auth";
import { Observable, of } from "rxjs";
import { TokenManagerService } from "@core/services/token-manager.service";
import { fromEvent } from "rxjs/observable/fromEvent";
import { merge } from "rxjs";
import { Router } from "@angular/router";
import { AuthGuard } from "./auth-guard.service";
@Injectable()
export class AuthUserService {
    constructor(
        private storageService: SessionStorageStore,
        private aclService: ACLService,
        private http: HttpClient,
        private tokenManager: TokenManagerService,
        private message: NzMessageService,
        private router: Router,
        private modalService: NzModalService,
        @Inject(DOCUMENT) private doc: Document
    ) {}
    private loginUrl: string = "/passport/login";
    public getUserAccess(
        username: string,
        password: string,
        codeId: string,
        verifyCode: string
    ) {
        return this.tokenManager
            .getAccess(username, password, codeId, verifyCode)
            .switchMap(data => this.getCurrentUser())
            .map(userData => {
                this.currentUser = userData;
                return userData;
            });
    }
    getConfig() {
        return this.http.get<Object>("/global/config").debug("获取配置信息");
    }
    getCurrentUser() {
        return this.http.get("/admin/user/current").debug("获取当前用户");
    }
    logout(): void {
        this.tokenManager.revokeAccessToken();
    }

    public get currentUser() {
        const userInfo = this.storageService.get("userInfo");
        return userInfo;
    }
    public set currentUser(user: any) {
        this.storageService.set("userInfo", user);

        this.aclService.setRole(user.roles.map(r => r.name));
    }

    public get isLoggedIn() {
        return Object.keys(this.currentUser).length !== 0;
    }

    // 获取验证码
    getVerifyCode(): Observable<any> {
        const url = "/verifyCode";
        return this.http.get<any>(url).debug("获取验证码");
    }
    hasPrivilege(code: string): boolean {
        // TODO Check user right
        return true;
    }

    // 超过30min无操作退出登录
    public timedExit(minutes: number) {
        const halfHour = minutes * 60 * 1000;
        merge(
            fromEvent(this.doc, "mousewheel"),
            fromEvent(this.doc, "mousemove"),
            fromEvent(this.doc, "click"),
            fromEvent(this.doc, "keydown")
        )
            .debounceTime(halfHour)
            .filter(e => {
                return this.isLoggedIn;
            })
            .subscribe(e => {
                this.message.info("30分钟无操作自动退出", { nzDuration: 1000 });
                this.logout();
            });
    }
}
