import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    ElementRef
} from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import { AddAccountComponent } from "./add-account/add-account.component";
import { AuthSettingService } from "../auth-setting.service";
import { htmlEscape } from "../../../utils/validate.rules";
import { AuthGuard } from "../../../core/services/auth-guard.service";
@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.less"]
})
export class AccountComponent implements OnInit {
    constructor(
        private modalService: NzModalService,
        private message: NzMessageService,
        private authService: AuthSettingService,
        private el: ElementRef,
        private authGuard: AuthGuard
    ) {}
    dataSet: Object[] = []; // 用户列表
    tplModal: NzModalRef;
    allChecked: boolean = false; // 默认是否全选
    indeterminate: boolean = false; // checkbox indeterminate 状态
    searchKey: string; // 搜索框的value（双向绑定）
    currentSearchKey: string; // 当前列表searchKey
    checkedNumber: number = 0; // 选中数量
    checkedData: Object[] = []; // 选中的data
    ispwdHidden: boolean = true; // 重置密码校验文字隐藏
    pwdBack: string; // pwd返回值
    current: number = 1; // 当前页码
    nzTotal: number = 0; // 数据总量
    pageSize: number = 10; // 每页展示多少条数据
    currentStatus: number;
    currentRoleId: number;
    statusList: Object[] = [
        { text: "正常", value: "0" },
        { text: "禁用", value: "1" },
        { text: "锁定", value: "2" }
    ];
    orderBy: string;
    sortRule: boolean = true;
    userNameSortRule: boolean;
    displayNameSortRule: boolean;
    hasSearchResult: boolean = true;
    // roleList: Object[] = [];
    // 复制密码按钮模板
    @ViewChild("tplCopy") tplCopy: TemplateRef<any>;

    // 清空搜索词
    emptySearchKey(): void {
        this.searchKey = null;
        this.currentSearchKey = null;
        this.getUsers();
    }

    // 全选
    // checkAll(value: boolean): void {
    //     this.dataSet.forEach(data => {
    //         data["checked"] = value;
    //     });
    //     this.refreshStatus();
    // }

    // 刷新checkbox状态
    refreshStatus(): void {
        const allChecked = this.dataSet
            .filter(value => !value["disabled"])
            .every(value => value["checked"] === true);
        const allUnChecked = this.dataSet
            .filter(value => !value["disabled"])
            .every(value => !value["checked"]);
        this.allChecked = allChecked;
        this.indeterminate = !allChecked && !allUnChecked;
        this.checkedData = this.dataSet.filter(value => value["checked"]);
        this.checkedNumber = this.dataSet.filter(
            value => value["checked"]
        ).length;
    }
    // 排序
    sort(sort: { key: string; value?: string }, type?: string): void {
        this.orderBy = sort.key;
        if (type === "toggle") {
            this.sortRule = !this.sortRule;
            this.userNameSortRule =
                sort.key === "user_name" ? this.sortRule : null;
            this.displayNameSortRule =
                sort.key === "display_name" ? this.sortRule : null;
            this.getUsers();
        } else {
            if (!sort.value) {
                this.orderBy = null;
            }
            this.sortRule = sort.value === "ascend" ? true : false;
            this.getUsers();
        }
    }

    // 用户角色筛选
    // filterRole(value: number): void {
    //     this.currentRoleId = value;
    //     this.getUsers();
    // }

    // 用户状态筛选
    filterStatus(value: string): void {
        this.current = 1;
        if (value) {
            this.currentStatus = +value;
        } else {
            this.currentStatus = undefined;
        }
        this.getUsers();
    }
    // 批量删除
    // deleteAll(): void {
    //     const users = [];
    //     this.checkedData.forEach((x, index) => {
    //         users.push(x["id"]);
    //     });
    //     if (users.length === 0) {
    //         this.message.create("error", "未选择用户");
    //         return;
    //     }
    //     this.authService.batchDeleteUser(users).subscribe(b => {
    //         //    console.log(b);
    //         if (b.code === 200) {
    //             this.message.create("success", "已删除");
    //             this.dataSet.forEach(value => (value["checked"] = false));
    //             this.refreshStatus();
    //             this.getUsers();
    //         }
    //     });
    // }
    // 增加&编辑用户
    addAccount(type: string, id?: string, name?: string): void {
        const addButton2 = this.el.nativeElement.querySelector(".modalButton2");
        if (this.nzTotal > 0 && addButton2) {
            // 兼容编辑按钮不存在的情况
            addButton2.blur();
        }
        const addButton = this.el.nativeElement.querySelector(".modalButton");
        if (addButton) addButton.blur();
        let title: string,
            buttonGroup = [];
        switch (type) {
            case "add":
                title = "新增用户";
                buttonGroup = [
                    {
                        label: "取消",
                        shape: "default",
                        onClick: () => modal1.destroy()
                    },
                    {
                        label: "保存",
                        shape: "primary",
                        onClick: () => {
                            const instance = modal1.getContentComponent();
                            instance.submitForm();
                        }
                    }
                ];
                break;
            case "edit":
                title = "编辑用户基本信息";
                buttonGroup = [
                    {
                        label: "取消",
                        shape: "default",
                        onClick: () => modal1.destroy()
                    },
                    {
                        label: "保存",
                        shape: "primary",
                        onClick: () => {
                            const instance = modal1.getContentComponent();
                            instance.submitForm();
                        }
                    }
                ];
                break;
            case "view":
                title = "查看用户基本信息";
                buttonGroup = [
                    {
                        label: "取消",
                        shape: "default",
                        onClick: () => modal1.destroy()
                    },
                    {
                        label: "编辑",
                        shape: "primary",
                        onClick: function() {
                            // 只能用function来改变this指向
                            const instance = modal1.getContentComponent();

                            if (this.label === "编辑") {
                                instance.type = "edit";
                                instance.showEdit();
                                this.label = "保存";
                            } else if (this.label === "保存") {
                                instance.submitForm();
                            }
                        }
                    }
                ];
                break;
        }

        const modal1 = this.modalService.create({
            nzTitle: title,
            nzContent: AddAccountComponent,
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzWidth: "640",
            nzStyle: { top: "20%" },
            nzComponentParams: {
                type: type,
                id: id,
                name: name
            },
            nzFooter: buttonGroup
        });
        modal1.afterClose.subscribe(() => {
            // 新增成功，刷新users
            const instance = modal1.getContentComponent();
            if (instance.isRefresh) {
                this.getUsers();
                if (instance.pwd) {
                    this.pwdBack = `用户名:${instance.userName} 密码:${
                        instance.pwd
                    }`;
                    this.poppwd("新建成功！");
                }
            }
        });
    }

    // 禁用用户
    confirmDisable(name: string, id: string): void {
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: `确认要禁用${name}吗？`,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doDisable(name, id)
        });
    }
    doDisable(name, id) {
        this.authService.disableUser(id).subscribe(b => {
            if (b.code === 200) {
                this.message.create("success", `账户"${name}"已禁用`);
                this.getUsers();
            }
        });
    }

    // 解禁
    confirmEnable(name: string, id: string): void {
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: `确认要解禁${name}吗？`,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doEnable(name, id)
        });
    }
    doEnable(name, id) {
        this.authService.enableUser(id).subscribe(b => {
            if (b.code === 200) {
                this.message.create("success", `账户"${name}"已解禁`);
                this.getUsers();
            }
        });
    }

    // 解锁
    confirmUnlock(name: string, id: string): void {
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: `确认要解锁${name}吗？`,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doUnlock(name, id)
        });
    }
    doUnlock(name, id) {
        this.authService.unlockUser(id).subscribe(b => {
            if (b.code === 200) {
                this.message.create("success", `账户"${name}"已解锁`);
                this.getUsers();
            }
        });
    }
    // 重置筛选
    resetFilter(): void {
        this.currentStatus = null;
        this.statusList = [
            { text: "正常", value: "0" },
            { text: "禁用", value: "1" },
            { text: "锁定", value: "2" }
        ];
    }
    // 获取用户列表
    getUsers(type?: string, roleId?: number): void {
        if (type === "click") {
            this.current = 1;
            this.resetFilter();
            this.currentSearchKey = htmlEscape(this.searchKey);
            //  this.currentSearchKey = this.searchKey;
        }
        this.authService
            .getUsers(
                this.currentSearchKey,
                roleId,
                this.pageSize,
                this.current,
                this.currentStatus,
                this.orderBy,
                this.sortRule
            )
            .subscribe(users => {
                this.handleResult(users["records"], users["total"]);
            });
    }
    handleResult(data: Object[], num) {
        const dataset = [];
        if (data && data.length > 0) {
            data.forEach((x, index) => {
                x["checked"] = false;
                dataset.push(x);
            });
        }
        this.dataSet = dataset;

        this.nzTotal = num;

        this.ifTableNoResult(num);
        this.refreshStatus();
    }
    // 判断无数据显示样式
    ifTableNoResult(result): void {
        if (result === 0 && !this.currentStatus) {
            this.hasSearchResult = false;
        } else {
            this.hasSearchResult = true;
        }
    }
    // 重置密码
    confirmReset(id: string, name: string): void {
        const confirmModal = this.modalService.confirm({
            nzTitle: "提示信息",
            nzContent: `确认要重置${name}的密码吗？`,
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => this.doResetPwd(id, name)
        });
    }
    doResetPwd(id, name) {
        this.authService.resetPwd(id).subscribe(b => {
            if (b.code === 200) {
                this.pwdBack = `用户名:${name}  密码:${b.password}`;
                this.poppwd("重置成功！");
            }
        });
    }
    // 重置后的密码弹窗
    pwdpop: any;
    poppwd(text): void {
        this.pwdpop = this.modalService.create({
            nzTitle: `${text}`,
            nzContent: this.tplCopy,
            nzWidth: "400px",
            nzStyle: { top: "30%" },
            nzFooter: null,
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" }
        });
        this.pwdpop.afterClose.subscribe(() => {
            this.pwdBack = null;
        });
    }
    // 复制用户名和密码成功
    copySuccess(): void {
        this.pwdpop.destroy();
        this.pwdpop = null; // 仅destroy无法将变量重置为null
        this.message.create("success", "复制成功");
    }

    // 重置密码
    resetPwd(id: string): void {
        this.authService.resetPwd(id).subscribe(result => {
            if (result.code === 200) {
                this.message.create(
                    "success",
                    '"' + name + '"' + "密码已重置！"
                );
                this.tplModal.destroy();
            }
        });
    }
    canOperate(type, roles) {
        let role: string = "";
        const names = [];
        if (roles) {
            if (roles.length === 0) {
                role = "none";
            } else {
                roles.forEach(x => {
                    names.push(x["name"]);
                });
                if (names.indexOf("系统管理员") !== -1) {
                    role = "admin";
                } else {
                    role = "other";
                }
            }
        }

        return !this.authGuard.getCanOperate(type, role);
    }

    // 随机颜色
    randomColor(id: number) {
        const style = id % 10;
        const colorGroup = [
            "#4177BD",
            "#6089C8",
            "#7FA0D0",
            "#62C1BB",
            "#EE7663",
            "#EDCA00",
            "#7267BC",
            "#AEA1E4",
            "#7AC8F6",
            "#87C8D7"
        ];
        return colorGroup[style];
    }
    ngOnInit() {
        // this.getRoles();
        this.getUsers();
    }
}
