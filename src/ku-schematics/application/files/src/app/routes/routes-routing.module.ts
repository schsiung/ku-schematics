import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { environment } from "@env/environment";
import { AuthGuard } from "@core/services/auth-guard.service";
// layout
import { LayoutDefaultComponent } from "../layout/default/default.component";
import { LayoutFullScreenComponent } from "../layout/fullscreen/fullscreen.component";
import { LayoutPassportComponent } from "../layout/passport/passport.component";
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
// settings pages
import { RolesComponent } from "./settings/roles/roles.component";
import { AccountComponent } from "./settings/account/account.component";
import { PersonalCenterComponent } from "./settings/personal-center/personal-center.component";
import { PermissionTypeComponent } from "./settings/source-licensing/permission-type/permission-type.component";
const routes: Routes = [
    {
        path: "",
        component: LayoutDefaultComponent,
        children: [
            { path: "", redirectTo: "account", pathMatch: "full" },
            {
                path: "dashboard",
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: { title: "仪表盘" }
            },
            {
                path: "roles",
                component: RolesComponent,
                canActivate: [AuthGuard],
                data: { title: "角色管理" }
            },
            {
                path: "account",
                component: AccountComponent,
                canActivate: [AuthGuard],
                data: { title: "用户管理" }
            },
            {
                path: "personal-center",
                component: PersonalCenterComponent,
                canActivate: [AuthGuard],
                data: { title: "个人中心" }
            },

            {
                path: "permission-type",
                component: PermissionTypeComponent,
                canActivate: [AuthGuard],
                data: { title: "权限管理" }
            },

            // 业务子模块
            {
                path: "extras",
                loadChildren: "./extras/extras.module#ExtrasModule",
                canActivate: [AuthGuard]
            }
            // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
        ]
    },
    // 全屏布局
    // {
    //     path: 'fullscreen',
    //     component: LayoutFullScreenComponent,
    //     children: [
    //     ]
    // },
    // passport
    {
        path: "passport",
        component: LayoutPassportComponent,
        children: [
            {
                path: "login",
                component: UserLoginComponent,
                data: { title: "用户登陆" }
            },
            {
                path: "register",
                component: UserRegisterComponent,
                data: { title: "用户注册" }
            },
            {
                path: "register-result",
                component: UserRegisterResultComponent,
                data: { title: "用户注册结果" }
            }
        ]
    },
    // 单页不包裹Layout
    { path: "403", component: Exception403Component },
    { path: "404", component: Exception404Component },
    { path: "500", component: Exception500Component },
    { path: "**", redirectTo: "dashboard" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
})
export class RouteRoutingModule {}
