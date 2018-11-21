import { NzMessageService } from "ng-zorro-antd";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
    Headers,
    RequestMethod,
    RequestOptions,
    URLSearchParams,
    ResponseContentType
} from "@angular/http";
import { Observable } from "rxjs";
import { HandleError } from "../../core/net/handleError";
import { catchError } from "rxjs/operators";

@Injectable()
export class ExtrasService {
    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private handler: HandleError
    ) {}

    // 修改密码
    public putModifyUserPassword(
        id: string,
        oldPassword: string,
        newPassword: string
    ): Observable<any> {
        const url = `/admin/user/${id}/changePassword`;
        const body = { oldPassword: oldPassword, newPassword: newPassword };
        return this.http
            .put(url, body)
            .debug("修改密码")
            .pipe(catchError(this.handler.handleError(`修改密码`)));
    }
    // /admin/user/find/{name}
    public getUserFindName(name) {
        const url = `/admin/user/find/${name}`;
        return this.http.get(url).toPromise();
    }
    public postAddUser(body) {
        const url = "/admin/user/";
        return this.http.post(url, body).toPromise();
    }
}
