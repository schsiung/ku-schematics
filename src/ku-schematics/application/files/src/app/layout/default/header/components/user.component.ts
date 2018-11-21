import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthUserService } from "@core/services/auth-user.service";
import { SessionStorageStore } from "@ku/auth";

@Component({
    selector: "header-user",
    template: `
    <nz-dropdown  nzPlacement="bottomRight" class="cscsDropdown">
        <div class="item d-flex align-items-center px-sm" nz-dropdown>
            <nz-avatar [nzSrc]="ava" nzSize="small" class="mr-sm"></nz-avatar>
          <span class="userName"> {{userDisplayName}}</span>
        </div>
        <div nz-menu class="width-sm">
            <div nz-menu-item routerLink="/extras/change" ><i class="anticon anticon-edit mr-sm"></i>修改密码</div>
            <li nz-menu-divider></li>
            <div nz-menu-item (click)="logout()"><i nz-icon type="poweroff" theme="outline"></i>退出登录</div>
        </div>
    </nz-dropdown>
    `,
    styles: [
        `:host /deep/ .cscsDropdown .userName{
            margin-left: 5px;
            line-height: 24px;
            display: block;
            float: left;
    }:host /deep/ .cscsDropdown .ant-avatar{
        float:left;
    }.ant-dropdown-trigger{
        height:auto;overflow:hidden;
    }`
    ]
})
export class HeaderUserComponent implements OnInit {
    ava = "./assets/img/avatar.jpg";
    constructor(
        public authUser: AuthUserService,
        private router: Router,
        private storageService: SessionStorageStore
    ) {}

    ngOnInit(): void {}

    logout() {
        return this.authUser.logout();
    }
    userDisplayName: string = this.storageService.get("userInfo")[
        "displayName"
    ];
}
