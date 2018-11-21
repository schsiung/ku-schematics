import { Component, OnInit, Inject, ElementRef } from "@angular/core";
import { NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import { htmlEscape } from "../../../../utils/validate.rules";
import { AuthGuard } from "../../../../core/services/auth-guard.service";
import { SourceLicensingService } from "../source-licensing.service";
import { AddPermissionTypeComponent } from "./add-permission-type/add-permission-type.component";

@Component({
    selector: "app-permission-type",
    templateUrl: "./permission-type.component.html",
    styleUrls: ["./permission-type.component.less"]
})
export class PermissionTypeComponent implements OnInit {
    constructor(
        private modalService: NzModalService,
        private message: NzMessageService,
        private service: SourceLicensingService,
        private el: ElementRef,
        private authGuard: AuthGuard
    ) {}
    dataSet: Object[] = [];
    searchKey: string;
    nzTotal: number = 0;
    current: number = 1; // 当前页码
    pageSize: number = 10; // 每页展示多少条数据
    hasResouceResult: boolean = true;
    // 新增+编辑权限类型
    emptySearchKey(): void {
        this.searchKey = null;
        this.getPermission();
    }
    addPermission(
        type: string,
        name?: string,
        code?: string,
        id?: number
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
            title = "新增权限";
            this.doEditPermission(title, name, code, type, id);
        } else if (type === "edit") {
            title = "编辑权限";
            this.confirmEdit(title, name, code, type, id);
        }
    }
    // 编辑权限
    confirmEdit(
        title: string,
        name: string,
        code: string,
        type: string,
        id: number
    ): void {
        const comfirmTitle: string = `修改权限定义可能会影响系统功能，确定编辑？`;
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: comfirmTitle,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doEditPermission(title, code, name, type, id)
        });
    }
    doEditPermission(title, code, name, type, id): void {
        const modal = this.modalService.create({
            nzTitle: title,
            nzContent: AddPermissionTypeComponent,
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzWidth: "640",
            nzStyle: { top: "25%" },
            nzComponentParams: {
                type: type,
                name: name,
                code: code,
                id: id
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
                this.getPermission();
            }
        });
    }
    // 删除权限
    confirmDelete(name: string, id: number): void {
        const title: string = `删除权限可能会影响系统功能，确定删除“${name}”？`;
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: title,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doDeletePermission(id, name)
        });
    }
    doDeletePermission(id, name): void {
        this.service.deletePermission(id).subscribe(b => {
            this.message.create("success", '"' + name + '"' + "已删除！");
            this.getPermission();
        });
    }
    // 获取权限列表
    getPermission(type?: string): void {
        if (type === "search") {
            this.current = 1;
        }
        const key = htmlEscape(this.searchKey);
        this.service
            .getPermissionByPage(key, this.pageSize, this.current)
            .subscribe(data => {
                if (data) {
                    this.nzTotal = data["total"];
                    this.dataSet = data["records"];
                    if (data["total"] > 0) {
                        this.hasResouceResult = true;
                    } else {
                        this.hasResouceResult = false;
                    }
                }
            });
    }
    canOperate(type, name?): boolean {
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
    ngOnInit() {
        this.getPermission();
    }
}
