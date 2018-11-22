import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import {
    Component,
    Input,
    TemplateRef,
    ViewChild,
    OnInit,
    AfterViewInit,
    ElementRef
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    ValidationErrors,
    ReactiveFormsModule
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { AuthSettingService } from "../../auth-setting.service";
import { Account, Role, SimpleRole } from "../../domain";
import { MatchRolenameReg } from "../../../../utils/validate.rules";
import { testIE } from "../../../../utils/browser.utils";
import { SourceLicensingService } from "../../source-licensing/source-licensing.service";
@Component({
    selector: "app-add-role",
    templateUrl: "./add-role.component.html",
    styleUrls: ["./add-role.component.less"]
})
export class AddRoleComponent implements OnInit, AfterViewInit {
    @Input() name: string;
    @Input() id: number;
    @Input() description: string;
    @Input() type: string;
    @Input() checkOptions: Object[];

    constructor(
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalRef,
        private authService: AuthSettingService,
        private resourceService: SourceLicensingService
    ) {}
    validateForm: FormGroup;
    isRefresh = false; // 供父组件判断是否刷新
    requiredPlaceholder: string = "必填";
    operationsPlaceholder: string = "请选择可用权限";
    AllAuthorizations: Object[];
    isReadonly: boolean = false;
    // 提交表单
    private submitGroup: Subject<Object> = new Subject<Object>();
    @ViewChild("focusInput") focusInput: ElementRef<HTMLInputElement>;
    submitForm() {
        // 表单校验
        const data = this.validateForm.value;
        if (data.name) {
            data.name = data.name.replace(/(^\s*)|(\s*$)/g, "");
            this.validateForm.controls["name"].setValue(data.name);
        }
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        if (this.validateForm.invalid) {
            return;
        }

        // 校验通过，执行新增
        if (this.type === "add") {
            this.submitGroup.next(data);
        }
        // 校验通过，执行编辑
        if (this.id && this.type === "edit") {
            this.submitGroup.next(data);
        }
    }
    doAdd(data) {
        this.authService.addRole(data).subscribe(a => {
            if (a) {
                this.message.success(`创建成功！`, { nzDuration: 1000 });
                this.isRefresh = true; // 供父组件判断是否刷新列表
                setTimeout(() => {
                    this.modal.destroy();
                }, 1000);
            }
        });
    }
    doEdit(data): void {
        this.authService.editRole(data, this.id).subscribe(b => {
            if (b) {
                this.message.success(`编辑成功！`, { nzDuration: 1000 });
                setTimeout(() => {
                    this.modal.destroy();
                }, 1000);
                this.isRefresh = true; // 供父组件判断是否刷新列表
            }
        });
    }
    // 控制ie下placeholder显影
    placeholderControl(): void {
        if (testIE()) {
            this.requiredPlaceholder = "";
            this.operationsPlaceholder = "";
        }
    }
    // 获取权限列表
    getAllPermissions() {
        this.resourceService.getAllPermissions().subscribe(data => {
            if (data) {
                this.AllAuthorizations = data;
            }
        });
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInput.nativeElement.focus(); // 自动聚焦，延迟500ms适配ie8
        }, 500);
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            name: [this.name, [Validators.required, Validators.maxLength(40)]],
            description: [this.description, [Validators.maxLength(80)]],
            authorizations: [this.checkOptions]
        });
        this.placeholderControl();
        this.getAllPermissions();
        if (this.type === "add") {
            this.submitGroup.pipe(throttleTime(2000)).subscribe(data => {
                this.doAdd(data);
            });
        } else {
            this.submitGroup.pipe(throttleTime(2000)).subscribe(data => {
                this.doEdit(data);
            });
        }
    }
}
