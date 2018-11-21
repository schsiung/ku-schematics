import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { Observable } from "rxjs/Observable";
import { of, throwError } from "rxjs";
import { TokenManagerService } from "../services/token-manager.service";
import { stringify } from "@angular/compiler/src/util";
@Injectable({
    providedIn: "root"
})
export class HandleError {
    constructor(
        private token: TokenManagerService,
        private message: NzMessageService
    ) {}
    handleError<T>(operation = "operation") {
        return (error: any): Observable<T> => {
            //  状态码为“4XX”以外的不显示message
            let showMessage: string =
                "Something bad happened; please try again later";
            const status = "" + error.error.status;
            if (status.startsWith("4")) {
                if (status === "403") {
                    showMessage = "用户验证已失效，请重新登录!";
                    this.message.error(showMessage, {
                        nzDuration: 1000
                    });
                    this.token.revokeAccessToken();
                } else {
                    showMessage = `${operation}失败: ${error.error.message}`;
                    this.message.create("error", showMessage);
                }
            } else {
                showMessage = `${operation}失败，请联系系统管理员！`;
                this.message.create("error", showMessage);
            }
            return throwError(showMessage);
        };
    }
}
