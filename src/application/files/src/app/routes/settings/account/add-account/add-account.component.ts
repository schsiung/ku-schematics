import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import {
    Component,
    Input,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    AbstractControl
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { Account, Role } from "../../domain";
import { AuthSettingService } from "../../auth-setting.service";
import { testIE } from "../../../../utils/browser.utils";
import {
    MatchUsernameReg,
    MatchDisplayNameReg
} from "../../../../utils/validate.rules";

@Component({
    selector: "app-add-account",
    templateUrl: "./add-account.component.html",
    styleUrls: ["./add-account.component.less"]
})
export class AddAccountComponent implements OnInit, AfterViewInit {
    @Input() name: string;
    @Input() id: string;
    @Input() type: string;
    @Input() roles: boolean; // 来源是角色管理的用户详情则为“true”

    constructor(
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalRef,
        private authService: AuthSettingService
    ) {}

    validateForm: FormGroup;
    isRefresh: boolean = false; // 供父组件判断是否刷新列表
    userRoles: any[] = []; // 用户所属角色列表
    // rolesTagValue: any[] = [];
    // userDetail: Account; // 用户详情初始值
    checkOptions: Object[] = []; // 角色展示值（全部系统角色or用户角色）
    attr: Object[] = []; // 用户属性列表
    isReadonly: boolean = true; // checkbox 是否禁用
    pwd: string; // 返回的密码
    stopCheck: boolean = false;
    userName: string; // 供父组件提取新建的用户名
    requiredPlaceholder: string = "必填";
    rolePlaceholder: string = "请赋予角色（可多选）";
    // submit节流
    private submitAddGroup: Subject<Object> = new Subject<Object>();
    private submitEditGroup: Subject<Object> = new Subject<Object>();
    @ViewChild("focusInput") focusInput: ElementRef<HTMLInputElement>;
    // 提交表单
    submitForm() {
        // 表单校验
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        // 校验通过
        if (this.validateForm.valid) {
            const value = this.validateForm.value;
            const data = {};
            const keys = Object.keys(value);
            keys.slice(0, 3).forEach(x => {
                data[x] = value[x];
            });
            data["roles"] = value["roles"];
            data["attr"] = [];
            const obj = {};
            keys.slice(4).forEach(x => {
                obj["key"] = x;
                obj["value"] = value[x];
                data["attr"].push(obj);
            });
            // 执行新增
            if (this.type === "add") {
                this.submitAddGroup.next(data);
            }
            // 执行编辑
            if (this.type === "edit") {
                if (this.id) {
                    data["id"] = this.id;
                } else {
                    return false;
                }
                this.submitEditGroup.next(data);
            }
        }
    }
    doAdd(data): void {
        this.authService.addUser(data).subscribe(result => {
            if (result) {
                this.isRefresh = true; // 供父组件判断是否刷新列表
                this.pwd = result.password;
                this.userName = data["userName"];
                this.message.success(`创建成功！`, { nzDuration: 1000 });
                setTimeout(() => {
                    this.modal.destroy();
                }, 1000);
            }
        });
    }
    doEdit(data): void {
        this.authService.editUser(data).subscribe(result => {
            if (result) {
                this.isRefresh = true; // 供父组件判断是否刷新列表
                this.message.success(`编辑成功！`, { nzDuration: 1000 });
                setTimeout(() => {
                    this.modal.destroy();
                }, 1000);
            }
        });
    }
    getUserById(): void {
        this.authService.getAccountDetailById(this.id).subscribe(user => {
            // this.userDetail = user;
            if (user) {
                switch (this.type) {
                    case "view":
                        this.showDetail();
                        break;
                    case "edit":
                        this.showEdit();
                        break;
                }
                // 处理用户属性
                const formControlAttr = {};
                if (user["attr"].length > 0) {
                    const attr = user["attr"];
                    for (let i = 0; i < attr.length; i++) {
                        formControlAttr[attr[i].key] = attr[i].value;
                    }
                }
                // 处理用户角色
                const rolesIds = [];
                if (user["roles"]) {
                    user["roles"].forEach((x, index) => {
                        rolesIds.push(x["id"]);
                    });
                }

                // 表单群体赋值
                let config = {
                    displayName: user["displayName"],
                    userName: user["userName"],
                    status: "" + user["status"], // 控件只识别string
                    roles: rolesIds
                };
                config = Object.assign(config, formControlAttr);
                this.validateForm.patchValue(config);
            }
        });
    }
    // open as 用户详情
    showDetail(): void {
        this.isReadonly = true;
        // this.getUserRoleList();
    }
    // open as 新增
    showAdd(): void {
        this.isReadonly = false;
        this.getAllRoleList();
    }
    // open as 编辑
    showEdit(): void {
        this.isReadonly = false;
        this.getAllRoleList();
        // this.getUserRoleList();
    }

    // 获取系统角色列表
    getAllRoleList(): void {
        this.checkOptions.length = 0;
        // const userRoles = this.userRoles;
        this.authService.getAllRoles().subscribe(roles => {
            if (roles) {
                roles.forEach((x, index) => {
                    // const checked = userRoles.some(a => {
                    //     return a.id === x.id;
                    // });
                    const obj = {
                        label: x["name"],
                        value: x["id"]
                    };
                    this.checkOptions.push(obj);
                });
            }
        });
    }

    getFormControl(name: string): AbstractControl {
        return this.validateForm.controls[name];
    }
    getAttr(): void {
        this.authService.getUserAttr().subscribe(list => {
            this.attr = list;
            if (list) {
                list.forEach(x => {
                    if (x["required"]) {
                        this.validateForm.addControl(
                            x["key"],
                            new FormControl(null, Validators.required)
                        );
                    } else {
                        this.validateForm.addControl(
                            x["key"],
                            new FormControl(null)
                        );
                    }
                });
            }

            if (this.id && this.type !== "add") {
                this.getUserById(); // 写在初始化时，避免详情——编辑之间的切换重复请求
            } else {
                this.showAdd(); // 无id或type为edit及view时，直接显示add框
            }
        });
    }
    // 兼容ie下input自动校验bug
    placeholderControl(): void {
        if (testIE()) {
            this.requiredPlaceholder = "";
            this.rolePlaceholder = "";
        }
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInput.nativeElement.focus(); // 自动聚焦，延迟500ms适配ie8
        }, 500);
    }
    ngOnInit() {
        // 初始化4项固定表单
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required, MatchUsernameReg]],
            displayName: [null, [Validators.required, MatchDisplayNameReg]],
            status: ["0"], // select的value只识别string
            roles: [null]
        });
        // 获取用户属性列表
        this.getAttr();
        this.placeholderControl();
        if (this.type === "add") {
            this.submitAddGroup.pipe(throttleTime(2000)).subscribe(data => {
                this.doAdd(data);
            });
        } else {
            this.submitEditGroup.pipe(throttleTime(2000)).subscribe(data => {
                this.doEdit(data);
            });
        }
    }
}
