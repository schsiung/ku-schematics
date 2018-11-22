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
    Validators,
    FormControl
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalRef } from "ng-zorro-antd";
import { MatchUsernameReg } from "../../../../../utils/validate.rules";
import { testIE } from "../../../../../utils/browser.utils";
import { SourceLicensingService } from "../../source-licensing.service";

@Component({
    selector: "app-add-permission-type",
    templateUrl: "./add-permission-type.component.html",
    styleUrls: ["./add-permission-type.component.less"]
})
export class AddPermissionTypeComponent implements OnInit, AfterViewInit {
    @Input() name: string;
    @Input() type: string;
    @Input() code: string;
    @Input() id: number;

    constructor(
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalRef,
        private service: SourceLicensingService
    ) {}
    validateForm: FormGroup;
    isRefresh = false; // 供父组件判断是否刷新
    requiredPlaceholder: string = "必填";
    codePlaceholder: string = "必填，例：userlist:create";
    // 提交表单
    private submitGroup: Subject<Object> = new Subject<Object>();
    @ViewChild("focusInput") focusInput: ElementRef<HTMLInputElement>;
    submitForm() {
        // 表单校验
        const data = this.validateForm.value;
        if (data.operationName) {
            const name = data.operationName.replace(/(^\s*)|(\s*$)/g, "");
            this.validateForm.controls["operationName"].setValue(name);
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
        if (this.code && this.type === "edit") {
            this.submitGroup.next(data);
        }
    }
    doAdd(data) {
        this.service.addPermission(data).subscribe(a => {
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
        this.service.editPermission(data, this.id).subscribe(b => {
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
            this.codePlaceholder = "";
        }
    }
    // 权限名校验
    MatchPermissionReg(control: FormControl) {
        const tell = control.value;
        if (!/^(?=[a-zA-Z]+:[a-zA-Z]+)[a-zA-Z:]{3,40}$/.test(tell)) {
            return { nomatch: true };
        } else {
            return null;
        }
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInput.nativeElement.focus(); // 自动聚焦，延迟500ms适配ie8
        }, 500);
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            operationName: [
                this.name,
                [Validators.required, Validators.maxLength(20)]
            ],
            operationCode: [
                this.code,
                [Validators.required, this.MatchPermissionReg]
            ]
        });
        this.placeholderControl();
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
