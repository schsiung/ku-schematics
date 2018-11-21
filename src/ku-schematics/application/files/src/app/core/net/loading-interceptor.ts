import { environment } from "./../../../environments/environment";
import { NzMessageService } from "ng-zorro-antd";
import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, retry, tap, finalize } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { BlockUI, NgBlockUI, BlockUIService } from "ng-block-ui";
import { TokenManagerService } from "@core/services/token-manager.service";
import { BlackList } from "@core/net/loading-black-list";
import { AuthGuard } from "../services/auth-guard.service";
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(
        private message: NzMessageService,
        private token: TokenManagerService,
        private authGuard: AuthGuard
    ) {}

    @BlockUI() blockUI: NgBlockUI;
    intercept(req, next: HttpHandler) {
        if (!environment.production) {
            console.warn("发起请求：" + req.url, req);
        }
        // loading黑名单
        if (BlackList) {
            BlackList.forEach(x => {
                const key = x["includedURL"];
                const method = x["method"];
                if (method !== req.method || req.url.indexOf(key) === -1) {
                    this.blockUI.start("Loading...");
                }
            });
        }

        return next
            .handle(req)
            .do(
                (event: HttpEvent<any>) => {
                    // 请求成功
                    // if (event instanceof HttpResponse) {
                    // }
                },
                (err: any) => {
                    // const status = "" + err.status;
                    // if (status === "403") {
                    //     this.message.error("用户验证已失效，请重新登录!", {
                    //         nzDuration: 1000
                    //     });
                    //     this.token.revokeAccessToken();
                    // }
                }
            )
            .pipe(
                finalize(() => {
                    this.blockUI.stop();
                })
            );
    }
}
