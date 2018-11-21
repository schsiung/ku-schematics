import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Operation, OperationList } from "./../domain";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd";
import { HandleError } from "../../../core/net/handleError";
@Injectable({
    providedIn: "root"
})
export class SourceLicensingService {
    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private handler: HandleError
    ) {}
    // operationURL: string = "http://10.100.44.46:9090/mock/7/v1/admin/operations";
    operationURL: string = "/admin/operations";

    // 获取有分页的权限列表
    getPermissionByPage(
        searchKey?: String,
        size?: number,
        current?: number
    ): Observable<OperationList> {
        let para = "";
        if (searchKey) {
            para += `&searchKey\=${searchKey}`;
        }
        if (size) {
            para += `&size\=${size}`;
        }
        if (current) {
            para += `&current\=${current}`;
        }
        para = para.substring(1);
        const url = `${this.operationURL}/page/?${para}`;
        return this.http
            .get<OperationList>(url)
            .debug("获取权限列表")
            .pipe(catchError(this.handler.handleError("获取权限列表")));
    }
    getAllPermissions(): Observable<Operation[]> {
        const url = `${this.operationURL}/`;
        return this.http
            .get<Operation[]>(url)
            .debug("获取全部权限")
            .pipe(catchError(this.handler.handleError("获取全部权限")));
    }
    // 新增权限
    addPermission(data: Object): Observable<Operation> {
        const url = `${this.operationURL}/`;
        return this.http
            .post<Operation>(url, data)
            .debug("新增权限")
            .pipe(catchError(this.handler.handleError("新增权限")));
    }
    // 编辑权限
    editPermission(data: Object, id: number): Observable<Operation> {
        const url = `${this.operationURL}/${id}`;
        return this.http
            .put<Operation>(url, data)
            .debug("编辑权限")
            .pipe(catchError(this.handler.handleError("编辑权限")));
    }
    // 删除权限
    deletePermission(id: number): Observable<any> {
        const url = `${this.operationURL}/${id}`;
        return this.http
            .delete(url)
            .debug("删除权限")
            .pipe(catchError(this.handler.handleError("删除权限")));
    }
}
