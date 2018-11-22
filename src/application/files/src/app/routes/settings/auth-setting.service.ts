import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Account, UserList, Attr, Role, SimpleRole } from "./domain";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd";
import { HandleError } from "../../core/net/handleError";

@Injectable({
    providedIn: "root"
})
export class AuthSettingService {
    userURL: string = "/admin/user";
    roleURL: string = "/admin/role";
    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private handler: HandleError
    ) {}

    // 获取用户详情
    getAccountDetailById(id: string): Observable<Account> {
        const url = `${this.userURL}/${id}`;
        return this.http
            .get<Account>(url)
            .debug("获取用户详情")
            .pipe(
                catchError(this.handler.handleError<Account>(`获取用户详情`))
            );
    }

    // 获取有分页的角色列表
    getRolesByPage(
        searchKey?: string,
        size?: number,
        current?: number
    ): Observable<SimpleRole[]> {
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
        const url = `${this.roleURL}/getRolesByPage?${para}`;
        return this.http
            .get<SimpleRole[]>(url)
            .debug("获取角色列表")
            .pipe(catchError(this.handler.handleError("获取角色列表")));
    }
    // 获取全部角色列表
    getAllRoles(searchKey?: string): Observable<SimpleRole[]> {
        let para = "";
        if (searchKey) {
            para += `&searchKey\=${searchKey}`;
        }
        para = para.substring(1);
        const url = `${this.roleURL}/getAllRoles?${para}`;
        return this.http
            .get<SimpleRole[]>(url)
            .debug("获取角色列表")
            .pipe(catchError(this.handler.handleError("获取角色列表")));
    }
    // 获取用户列表
    getUsers(
        searchKey?: string,
        roleId?: number,
        size?: number,
        current?: number,
        status?: number,
        orderByField?: string,
        sortRule?: boolean
    ): Observable<UserList> {
        let para = "";
        if (searchKey) {
            para += `&searchKey\=${searchKey}`;
        }
        if (roleId) {
            para += `&roleId\=${roleId}`;
        }
        if (size) {
            para += `&size\=${size}`;
        }
        if (current) {
            para += `&current\=${current}`;
        }
        if (status !== undefined && status !== null) {
            para += `&status\=${status}`;
        }
        // user_name | display_name
        if (orderByField !== undefined && orderByField !== null) {
            para += `&orderByField\=${orderByField}`;
        }
        // ascend | descend
        if (sortRule !== undefined && sortRule !== null) {
            para += `&asc\=${sortRule}`;
        }
        para = para.substring(1);
        const url = `${this.userURL}/getUsers?${para}`;
        return this.http
            .get<UserList>(url)
            .debug("获取用户列表")
            .pipe(
                catchError(this.handler.handleError<UserList>("获取用户列表"))
            );
    }

    // 新增用户
    addUser(data: object): Observable<any> {
        const url = this.userURL;
        return this.http
            .post(url, data)
            .debug("新增用户")
            .pipe(catchError(this.handler.handleError("新增用户")));
    }
    // 新增角色
    addRole(data: object): Observable<any> {
        const url = this.roleURL;
        return this.http
            .post(url, data)
            .debug("新增角色")
            .pipe(catchError(this.handler.handleError("新增角色")));
    }
    // 编辑角色
    editRole(data: object, id: number): Observable<any> {
        // console.log("editrole", data);
        const url = `${this.roleURL}/${id}`;
        return this.http
            .put(url, data)
            .debug("编辑角色")
            .pipe(catchError(this.handler.handleError("编辑角色")));
    }
    // 编辑用户
    editUser(data): Observable<any> {
        //  console.log("editUser", data);
        const url = `${this.userURL}/${data.id}`;
        return this.http
            .put(url, data)
            .debug("编辑用户")
            .pipe(catchError(this.handler.handleError("编辑用户")));
    }
    // 删除角色
    deleteRole(id: string): Observable<any> {
        const url = `${this.roleURL}/${id}`;
        return this.http
            .delete(url)
            .debug("删除角色")
            .pipe(catchError(this.handler.handleError("删除角色")));
    }
    // 删除单个用户
    deleteUser(id: string): Observable<any> {
        const url = `${this.userURL}/${id}`;
        return this.http
            .delete(url)
            .debug("删除用户")
            .pipe(catchError(this.handler.handleError("删除用户")));
    }
    // 批量删除用户（delete不接受body，改为put）
    // batchDeleteUser(users): Observable<any> {
    //     const url = `${this.userURL}/batch`;
    //     //  console.log(users);
    //     return this.http
    //         .put(url, users)
    //         .debug("批量删除用户")
    //         .pipe(catchError(this.handler.handleError("批量删除用户")));
    // }

    // 禁用用户
    disableUser(id: string): Observable<any> {
        const url = `${this.userURL}/disable/${id}`;
        return this.http
            .put(url, {})
            .debug("禁用用户")
            .pipe(catchError(this.handler.handleError("禁用用户")));
    }
    // 解禁用户
    enableUser(id: string): Observable<any> {
        const url = `${this.userURL}/enable/${id}`;
        return this.http
            .put(url, {})
            .debug("解禁用户")
            .pipe(catchError(this.handler.handleError("解禁用户")));
    }
    // 解锁用户
    unlockUser(id: string): Observable<any> {
        const url = `${this.userURL}/unlock/${id}`;
        return this.http
            .put(url, {})
            .debug("解锁用户")
            .pipe(catchError(this.handler.handleError("解锁用户")));
    }

    // 获取角色详情
    getRoleDetail(id: number, size: number, current: number): Observable<Role> {
        let url = `${this.roleURL}/${id}?`;
        let para: string = "";
        if (size) {
            para += `&size\=${size}`;
        }
        if (current) {
            para += `&current\=${current}`;
        }
        para = para.substring(1);
        url += para;
        return this.http
            .get<Role>(url)
            .debug("获取角色详情")
            .pipe(catchError(this.handler.handleError<Role>(`获取角色详情`)));
    }
    // 获取用户可用属性
    getUserAttr(): Observable<Attr[]> {
        const url = `${this.userURL}/attr`;
        return this.http
            .get<Attr[]>(url)
            .debug("获取用户属性")
            .pipe(catchError(this.handler.handleError<Attr[]>(`获取用户属性`)));
    }
    // 重置密码
    resetPwd(id: string): Observable<any> {
        const url = `${this.userURL}/${id}/reset`;
        return this.http
            .put<any>(url, {})
            .debug("重置密码")
            .pipe(catchError(this.handler.handleError(`重置密码`)));
    }
}
