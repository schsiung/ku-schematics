import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit
} from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from "@angular/router";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    AbstractControl
} from "@angular/forms";
import { ExtrasService } from "../extras.service";
import {
    MatchPasswordReg,
    MatchPasswordEquar
} from "../../../utils/validate.rules";
import { TokenManagerService } from "@core/services/token-manager.service";

@Component({
    selector: "app-change-password",
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.less"]
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
    validateForm: FormGroup;
    textInNewP: string = " 8-64位,包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符";
    constructor(
        public fb: FormBuilder,
        public msg: NzMessageService,
        public extrasService: ExtrasService,
        private router: Router,
        private token: TokenManagerService
    ) {}
    @ViewChild("focusInput") focusInput: ElementRef<HTMLInputElement>;
    @ViewChild("focusInput2") focusInput2: ElementRef<HTMLInputElement>;
    @ViewChild("focusInput3") focusInput3: ElementRef<HTMLInputElement>;
    pwdSave(): void {
        const userInfo: string = window.sessionStorage.getItem("userInfo");
        const obj: object = JSON.parse(userInfo);
        const id = obj["id"];
        const data = this.validateForm.value;
        this.extrasService
            .putModifyUserPassword(id, data["oldPassword"], data["newPassword"])
            .subscribe(result => {
                if (result) {
                    this.msg.success("修改密码成功,请重新登录!", {
                        nzDuration: 1000
                    });
                    this.goRank();
                }
            });
    }
    goRank(): void {
        this.token.revokeAccessToken();
    }
    updateConfirmEqual(): void {
        Promise.resolve().then(() =>
            this.validateForm.controls["new_password"].updateValueAndValidity()
        );
    }
    submitForm(): void {
        setTimeout(() => {
            for (const i in this.validateForm.controls) {
                this.validateForm.controls[i].markAsDirty();
                this.validateForm.controls[i].updateValueAndValidity();
            }
            if (this.validateForm.invalid) {
                return;
            } else {
                this.pwdSave();
            }
        }, 0);
        this.focusInput2.nativeElement.blur(); // 回车提交时未blur，无法触发input值变化
    }

    // 兼容ie下input自动校验bug
    testIE(): void {
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf("NET") !== -1 && userAgent.indexOf("rv") !== -1) {
            this.textInNewP = "";
        }
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            oldPassword: [null, [Validators.required]],
            newPassword: new FormControl(null, {
                validators: [Validators.required, MatchPasswordReg],
                updateOn: "blur"
            }),
            new_password: [null, [Validators.required, MatchPasswordEquar]]
            // new_password: new FormControl(null, {
            //     validators: [Validators.required, MatchPasswordEquar],
            //     updateOn: "submit"
            // })
        });
        this.testIE();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInput.nativeElement.focus(); // 自动聚焦，延迟500ms适配ie8
        }, 500);
    }
    getFormControl(name) {
        return this.validateForm.controls[name];
    }
}
