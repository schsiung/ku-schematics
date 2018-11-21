import { Component, HostBinding, OnInit } from "@angular/core";
import {
    Router,
    NavigationStart,
    NavigationEnd,
    ActivatedRoute,
    NavigationError,
    NavigationCancel
} from "@angular/router";
import { Observable, of, pipe } from "rxjs";
import { filter } from "rxjs/operators";
import { AuthUserService } from "@core/services/auth-user.service";
import { SettingsService, TitleService } from "@ku/ui";
import { BlockUI, NgBlockUI, BlockUIService } from "ng-block-ui";
import { StorageService } from "./core/services/storage.service";
import { AuthGuard } from "./core/services/auth-guard.service";
import { StartupService } from "@core/startup/startup.service";

@Component({
    selector: "app-root",
    template: `<router-outlet></router-outlet><block-ui message="loading..."></block-ui>`
})
export class AppComponent implements OnInit {
    @HostBinding("class.layout-fixed")
    get isFixed() {
        return this.settings.layout.fixed;
    }
    @HostBinding("class.layout-boxed")
    get isBoxed() {
        return this.settings.layout.boxed;
    }
    @HostBinding("class.aside-collapsed")
    get isCollapsed() {
        return this.settings.layout.collapsed;
    }

    constructor(
        private settings: SettingsService,
        private authUserService: AuthUserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authGuard: AuthGuard,
        private startUp: StartupService
    ) {}
    @BlockUI() blockUI: NgBlockUI;
    ngOnInit() {
        // 定时退出
        this.authUserService.timedExit(30);
        // 初次进入默认点击, 防止用户通过浏览器记录(chrome ctrl+shift+T)打开窗口且为已登录状态时不退出
        document.querySelector("body").click();

        this.router.events.subscribe(event => {
            // console.log("路由事件：" + event);

            if (event instanceof NavigationStart) {
                this.blockUI.start("Loading...");
            }
            if (event instanceof NavigationEnd) {
                if (event.url === "/passport/login") {
                    window.sessionStorage.clear();
                    this.startUp.load();
                }
                this.blockUI.stop();
            }
            if (event instanceof NavigationError) {
                this.blockUI.stop();
            }
            if (event instanceof NavigationCancel) {
                this.blockUI.stop();
            }
        });
    }
}
