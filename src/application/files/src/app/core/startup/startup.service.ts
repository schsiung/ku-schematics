import { Router } from "@angular/router";
import { Injectable, Injector, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { zip } from "rxjs/observable/zip";
import { catchError } from "rxjs/operators";
import { MenuService, SettingsService, TitleService } from "@ku/ui";
import { ACLService, LocalStorageStore, SessionStorageStore } from "@ku/auth";

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable({
    providedIn: "root"
})
export class StartupService {
    constructor(
        private sessionStorage: SessionStorageStore,
        private menuService: MenuService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private injector: Injector
    ) {}

    private viaHttp(resolve: any, reject: any) {
        zip(
            this.httpClient.get("/assets/app-data.json"),
            this.httpClient.get("/assets/auth-control.json"),
            (a, b) => {
                a["auth"] = b;
                return a;
            }
        )
            .pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([appData]) => {
                    resolve(null);
                    return [appData];
                })
            )
            .subscribe(
                appData => {
                    // application data
                    const res: any = appData;
                    this.sessionStorage.set("AppData", res);
                    // 应用信息：包括站点名、描述、年份
                    this.settingService.setApp(res.app);
                    // 用户信息：包括姓名、头像、邮箱地址
                    // this.settingService.setUser(res.user);
                    // ACL：设置权限为全量
                    // this.aclService.setFull(true);
                    // 初始化菜单
                    this.refreshMenu();

                    // 设置页面标题的后缀
                    this.titleService.suffix = res.app.name;
                },
                () => {},
                () => {
                    resolve(null);
                }
            );
    }
    // 刷新页面or首次加载读取存储，重新初始化
    refreshMenu() {
        const menu = this.sessionStorage.get("Auth")["currentMenu"];
        if (menu) {
            this.menuService.add(menu);
        }
    }
    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            // http
            this.viaHttp(resolve, reject);
            // mock
            // this.viaMock(resolve, reject);
        });
    }
}
