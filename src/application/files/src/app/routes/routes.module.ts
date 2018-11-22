import { NgModule, ViewRef } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouteRoutingModule } from "./routes-routing.module";
// dashboard pages
import { DashboardComponent } from "./dashboard/dashboard.component";
// passport pages
import { UserLoginComponent } from "./passport/login/login.component";
import { UserRegisterComponent } from "./passport/register/register.component";
import { UserRegisterResultComponent } from "./passport/register-result/register-result.component";
// single pages
import { Exception403Component } from "./exception/403.component";
import { Exception404Component } from "./exception/404.component";
import { Exception500Component } from "./exception/500.component";
import { RolesComponent } from "./settings/roles/roles.component";
import { AddRoleComponent } from "./settings/roles/add-role/add-role.component";
import { AccountComponent } from "./settings/account/account.component";
import { AddAccountComponent } from "./settings/account/add-account/add-account.component";

import { ViewRoleComponent } from "./settings/roles/view-role/view-role.component";
import { PersonalCenterComponent } from "./settings/personal-center/personal-center.component";
import { PermissionTypeComponent } from "./settings/source-licensing/permission-type/permission-type.component";
import { AddPermissionTypeComponent } from "./settings/source-licensing/permission-type/add-permission-type/add-permission-type.component";

@NgModule({
    imports: [SharedModule, RouteRoutingModule],
    declarations: [
        DashboardComponent,
        // passport pages
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent,
        // single pages
        Exception403Component,
        Exception404Component,
        Exception500Component,
        // 角色权限及账号管理
        RolesComponent,
        AddRoleComponent,
        ViewRoleComponent,
        AccountComponent,
        AddAccountComponent,
        PersonalCenterComponent,
        PermissionTypeComponent,
        AddPermissionTypeComponent
    ],
    entryComponents: [
        // 动态加载的模板
        AddRoleComponent,
        ViewRoleComponent,
        AddAccountComponent,
        AddPermissionTypeComponent
    ]
})
export class RoutesModule {}
