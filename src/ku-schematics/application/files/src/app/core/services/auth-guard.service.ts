import { NzMessageService } from "ng-zorro-antd";
import { Injectable } from "@angular/core";
import {
    CanActivate,
    CanDeactivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad,
    Route
} from "@angular/router";
import { AuthUserService } from "@core/services/auth-user.service";
import { ACLService } from "@ku/auth";
import { SessionStorageStore } from "@ku/auth";
import { MenuService } from "@ku/ui";

/**
 * 基于@ku/auth的ACLGuard封装抽象
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private router: Router,
        private authUser: AuthUserService,
        private sessionStorage: SessionStorageStore,
        private aclService: ACLService,
        private menuService: MenuService,
        private message: NzMessageService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const url: string = state.url;
        const queryParameter = route.queryParams;
        if (!this.checkLogin()) {
            this.router.navigate(["/passport/login"]);
            return;
        }

        this.aclService.setRole(
            // this.authUser.currentUser.roles.map(r => r.name)
            this.getRoleByCurrentUser().split(",")
        );
        const guarder = this.getAuthGuardByUrl(state.url);
        if (this.aclService.can(guarder)) {
            return true;
        } else {
            this.router.navigate(["/403"]);
        }
    }

    canDeactivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const url: string = state.url;
        return true;
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin();
    }

    checkLogin(): boolean {
        return this.authUser.isLoggedIn;
    }

    // 获取对跳转路由的跳转规则（旧方案待改）
    getAuthGuardByUrl(url: string) {
        // const aclRules = this.getAclRules();
        const aclRules = this.sessionStorage.get("AppData")["aclRules"];
        const guarder =
            (aclRules &&
                Array.isArray(aclRules) &&
                aclRules.find(x => x.url === url)) ||
            {};
        return guarder["guard"];
    }

    // 获取当前用户登录跳转地址
    getEntry() {
        return this.sessionStorage.get("Auth")["currentEntry"];
    }
    // 获取当前用户操作权限列表
    getOperation() {
        return this.sessionStorage.get("Auth")["currentOperation"];
    }
    // 获取当前用户访问权限
    getAclRules() {
        return this.sessionStorage.get("Auth")["currentAclRules"];
    }
    // 获取当前用户可见菜单
    getMenu() {
        return this.sessionStorage.get("Auth")["currentMenu"];
    }
    // 返回是否可操作
    getCanOperate(type: string, role?) {
        const config: Array<Object> =
            this.sessionStorage.get("Auth")["currentOperation"] || [];
        const currentRole: string = this.sessionStorage.get("Auth")["role"];
        let can: boolean = true;
        if (config && config.length > 0) {
            config.forEach(x => {
                if (x["type"] === type) {
                    switch (x["allow"]) {
                        case 0:
                            can = true;
                            break;
                        case 1:
                            can = false;
                            break;
                        case 2:
                            if (
                                currentRole === "admin" &&
                                role &&
                                currentRole === role
                            ) {
                                can = false;
                            } else {
                                can = true;
                            }
                            break;
                    }
                }
            });
        } else {
            can = false;
        }
        return can;
    }
    // 获取当前用户归类角色（临时方案）
    getRoleByCurrentUser(): string {
        const names = this.getCurrentUserRole();
        if (names.length === 0) {
            return "none";
        } else if (names.indexOf("系统管理员") !== -1) {
            return "admin";
        } else {
            return "other";
        }
    }
    // 获取当前用户全部角色
    getCurrentUserRole(): Array<String> {
        const user = this.sessionStorage.get("userInfo") || {};
        const names = [];
        if (user && user["roles"].length > 0) {
            user["roles"].forEach(x => {
                names.push(x["name"]);
            });
        }
        return names;
    }
    getUserOperates(): string[] {
        return this.sessionStorage.get("userInfo")["authorizations"] || [];
    }

    hasAuth(code): boolean {
        const data = this.getUserOperates();
        if (data.indexOf(code) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    // 初始化菜单
    setMenu(menu) {
        this.menuService.add(menu);
    }

    // 获取当前用户全部权限，存入本地存储
    saveAuthByCurrentUser(): void {
        const authConfig: Array<Object> =
            this.sessionStorage.get("AppData")["auth"] || [];

        const role = this.getRoleByCurrentUser();
        let currentEntry: string = "";
        let currentOperation: Object = {};
        let currentAclRules: Array<Object> = [];
        let currentMenu: Array<Object> = [];
        if (authConfig && authConfig.length > 0) {
            authConfig.forEach(x => {
                if (x["roleName"] === role) {
                    currentOperation = x["operation"];
                    currentEntry = x["entry"];
                    currentAclRules = x["aclRules"];
                    currentMenu = x["menu"];
                }
            });
        }

        const currentAuth = {
            role: role,
            currentEntry: currentEntry,
            currentOperation: currentOperation,
            currentAclRules: currentAclRules,
            currentMenu: currentMenu
        };
        this.sessionStorage.set("Auth", currentAuth);
        this.setMenu(currentMenu); // 初始化菜单
    }
}
