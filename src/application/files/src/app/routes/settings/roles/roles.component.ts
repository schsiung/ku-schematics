import { Component, OnInit, Inject, ElementRef } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { AddRoleComponent } from "./add-role/add-role.component";
import { ViewRoleComponent } from "./view-role/view-role.component";
import { NzMessageService } from "ng-zorro-antd";
import { AuthSettingService } from "../auth-setting.service";
import { Account, Role, SimpleRole } from "../domain";
import { htmlEscape } from "../../../utils/validate.rules";
import { AuthGuard } from "../../../core/services/auth-guard.service";

@Component({
    selector: "app-roles",
    templateUrl: "./roles.component.html",
    styleUrls: ["./roles.component.less"]
})
export class RolesComponent implements OnInit {
    constructor(
        private modalService: NzModalService,
        private message: NzMessageService,
        private authService: AuthSettingService,
        private el: ElementRef,
        private authGuard: AuthGuard
    ) {}
    dataSet: SimpleRole[];
    tplModal: NzModalRef;
    roles: SimpleRole[];
    searchKey: string;
    nzTotal: number = 0;
    current: number = 1; // 当前页码
    pageSize: number = 10; // 每页展示多少条数据
    hasRoleResult: boolean = true;
    authNames: object[] = [];
    // 新增+编辑角色权限
    emptySearchKey() {
        this.searchKey = null;
        this.getRoles();
    }
    addRole(
        type: string,
        id?: number,
        name?: string,
        description?: string,
        operations?: Object[]
    ): void {
        const addButton2 = this.el.nativeElement.querySelector(".modalButton2");
        if (this.nzTotal > 0 && addButton2) {
            // 兼容编辑按钮不存在的情况
            addButton2.blur();
        }
        const addButton = this.el.nativeElement.querySelector(".modalButton");
        if (addButton) addButton.blur();
        let title = "";
        if (type === "add") {
            title = "新增角色";
        } else if (type === "edit") {
            title = "编辑角色";
        }

        const checkedOptions = this.getOperationIds(operations);
        const modal = this.modalService.create({
            nzTitle: title,
            nzContent: AddRoleComponent,
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzWidth: "640",
            nzStyle: { top: "20%" },
            nzComponentParams: {
                type: type,
                id: id,
                name: name,
                description: description,
                checkOptions: checkedOptions
            },
            nzFooter: [
                {
                    label: "取消",
                    shape: "default",
                    onClick: () => modal.destroy()
                },
                {
                    label: "保存",
                    shape: "primary",
                    onClick: () => {
                        const instance = modal.getContentComponent();
                        instance.submitForm();
                    }
                }
            ]
        });
        modal.afterClose.subscribe(() => {
            const instance = modal.getContentComponent();
            if (instance.isRefresh) {
                this.getRoles();
            }
        });
    }
    getOperationIds(data: object[]): number[] {
        const ad = [];
        if (data) {
            data.forEach(x => {
                ad.push(x["operationId"]);
            });
        }

        return ad;
    }
    // 查看角色详情
    viewDetail(id: number, name: string) {
        const title = name + " (ID:" + id + ")";
        const modal3 = this.modalService.create({
            nzTitle: title,
            nzContent: ViewRoleComponent,
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzWidth: "600",
            nzComponentParams: {
                id: id,
                name: name
            },
            nzFooter: [
                {
                    label: "取消",
                    shape: "default",
                    onClick: () => modal3.destroy()
                }
            ]
        });
    }

    // 删除角色
    confirmDelete(num: number, name: string, id: number): void {
        const title: string = `确定要删除角色${name}吗？`;
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: title,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doDeleteRole(id, name)
        });
    }
    doDeleteRole(id, name) {
        this.authService.deleteRole(id).subscribe(b => {
            this.message.create("success", '"' + name + '"' + "已删除！");
            this.getRoles();
        });
    }
    // 获取角色列表
    getRoles(type?: string) {
        if (type === "search") {
            this.current = 1;
        }
        const key = htmlEscape(this.searchKey);
        this.authService
            .getRolesByPage(key, this.pageSize, this.current)
            .subscribe(roles => {
                if (roles) {
                    this.nzTotal = roles["total"];
                    this.dataSet = roles["records"];
                    if (roles["total"] > 0) {
                        this.hasRoleResult = true;
                    } else {
                        this.hasRoleResult = false;
                    }
                }
            });
    }
    canOperate(type, name?) {
        let role: string = "";
        if (name) {
            if (name === "系统管理员") {
                role = "admin";
            } else {
                role = "other";
            }
        } else {
            role = "none";
        }

        return !this.authGuard.getCanOperate(type, role);
    }
    popVisibleChange(value: boolean, auth: object[]): void {
        if (value) {
            const authNames = [];
            auth.forEach(x => {
                authNames.push(x["operationName"]);
            });
            this.authNames = authNames;
        } else {
            this.authNames = [];
        }
    }
    ngOnInit() {
        this.getRoles();
    }
}
