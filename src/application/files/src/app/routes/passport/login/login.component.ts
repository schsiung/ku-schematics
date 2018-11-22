import { SessionStorageStore } from "@ku/auth";
import {
    Component,
    OnDestroy,
    Inject,
    Optional,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Renderer2
} from "@angular/core";
import { Router } from "@angular/router";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { AuthUserService } from "@core/services/auth-user.service";
import { TokenManagerService } from "../../../core/services/token-manager.service";
import { testIE } from "../../../utils/browser.utils";
import { AuthGuard } from "../../../core/services/auth-guard.service";

@Component({
    selector: "passport-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.less"]
})
export class UserLoginComponent implements OnDestroy, OnInit, AfterViewInit {
    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private authUser: AuthUserService,
        private token: TokenManagerService,
        private renderer: Renderer2,
        private storage: SessionStorageStore,
        private authGuard: AuthGuard
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, this.usernameValidator]],
            password: [null, [Validators.required, this.passwordValidator]],
            verifyCode: [null, [Validators.required, this.verifyCodeValidator]]
        });
    }
    form: FormGroup;
    type: number = 0;
    loading: boolean = false;
    isUserFocused: boolean = false;
    isPwFocused: boolean = false;
    isVCFocused: boolean = false;
    codeImgSrc: string; // 验证码图片地址
    codeId: string; // 验证码id
    pwdInvalid: boolean = false; // 用户名密码正确性校验的状态
    vcOverdue: boolean = false; // 验证码过期校验的状态
    vcFail: boolean = false; // 验证码正确性校验的状态
    phUsername: string = "请输入账户名";
    phPassword: string = "请输入密码";
    phCode: string = "请输入验证码";
    lockTimes: number = 10;
    @ViewChild("focusInput") focusInput: ElementRef<HTMLInputElement>;
    // 异步校验规则——账号/密码错误
    passwordValidator = (control: FormControl): { [s: string]: boolean } => {
        //  console.log("passwordValidator", this.pwdInvalid);
        if (this.pwdInvalid) {
            return { confirm: true };
        }
    };
    usernameValidator = (control: FormControl): { [s: string]: boolean } => {
        //  console.log("passwordValidator", this.pwdInvalid);
        if (this.pwdInvalid) {
            return { confirm: true };
        }
        return null;
    };
    // 自定义校验规则——验证码过期/错误
    verifyCodeValidator = (control: FormControl): { [s: string]: boolean } => {
        //   console.log("verifyCodeValidator", this.vcOverdue, this.vcFail);
        if (this.vcOverdue) {
            return { overdue: true };
        }
        if (this.vcFail) {
            return { wrong: true };
        }
        return null;
    };
    get userName() {
        return this.form.controls.userName;
    }
    get password() {
        return this.form.controls.password;
    }
    get verifyCode() {
        return this.form.controls.verifyCode;
    }
    get mobile() {
        return this.form.controls.mobile;
    }
    get captcha() {
        return this.form.controls.captcha;
    }

    count: number;
    interval$: any;
    // 验证码倒计时
    getCaptcha() {
        this.interval$ = setInterval(() => {
            this.count -= 1;
            // console.log(this.count);
            if (this.count <= 0) clearInterval(this.interval$);
        }, 1000);
    }

    // 刷新验证码
    refreshVC(): void {
        clearInterval(this.interval$);
        this.authUser.getVerifyCode().subscribe({
            next: data => {
                if (data) {
                    this.codeImgSrc =
                        "data:image/png;base64," + data.verifyCodeSrc;
                    this.codeId = data.verifyCodeId;
                    this.count = data.effectiveTime;
                    this.getCaptcha();
                } else {
                    this.customErrorOfVC();
                }
            },
            error: error => {
                // 避免暴露状态码为“5xx”的系统错误信息
                if (status.startsWith("4")) {
                    this.msg.create("error", error.error.message);
                } else {
                    this.customErrorOfVC();
                }
                this.codeImgSrc = null;
                this.codeId = null;
            },
            complete: () => {
                this.verifyCode.setValue("");
            }
        });
    }

    customErrorOfVC(): void {
        this.msg.create("error", `获取验证码失败，请联系系统管理员！`);
    }
    submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) {
            return;
        }
        if (!this.codeId || !this.codeImgSrc) {
            this.customErrorOfVC();
            return;
        }
        //    console.log("倒计时", this.count);
        if (this.count <= 0) {
            this.vcOverdue = true;
            this.validateConfirmVerifyCode(this.verifyCode.value);
            this.refreshVC();
            return;
        }

        this.loading = true;
        this.authUser
            .getUserAccess(
                this.userName.value,
                this.password.value,
                this.codeId,
                this.verifyCode.value
            )
            .subscribe({
                next: currentUser => {
                    //  console.log("当前用户", JSON.stringify(currentUser));
                    this.authGuard.saveAuthByCurrentUser();
                    this.redirectToEntryUrl();
                },
                error: error => {
                    const status = "" + error.status;
                    const code = "" + error.error.code;
                    switch (code) {
                        case "100000":
                            // 用户名或密码错误
                            this.pwdInvalid = true;
                            this.validateConfirmPassword(this.password.value);
                            this.refreshVC();
                            this.msg.create("error", "用户名或密码错误！");
                            break;
                        case "100004":
                            this.msg.create(
                                "error",
                                "用户已禁用,请联系系统管理员！"
                            );
                            this.refreshVC();
                            break;
                        case "100003":
                            this.msg.create(
                                "error",
                                `密码错误${
                                    this.lockTimes
                                }次, 用户已锁定, 请联系系统管理员！`
                            );
                            this.refreshVC();
                            break;
                        case "100001":
                            // 验证码超时
                            this.vcOverdue = true;
                            this.validateConfirmVerifyCode(
                                this.verifyCode.value
                            );
                            this.refreshVC();
                            break;
                        case "100002":
                            // 验证码错误
                            this.vcFail = true;
                            this.validateConfirmVerifyCode(
                                this.verifyCode.value
                            );
                            this.refreshVC();
                            break;
                        default:
                            this.msg.create("error", error.error.message);
                            this.refreshVC();
                    }
                },
                complete: () => {
                    this.loading = false;
                }
            });
    }

    redirectToEntryUrl() {
        const url = this.authGuard.getEntry();
        this.router.navigate([url]);
    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
    // 更新password校验状态
    validateConfirmPassword(ev, type?): void {
        if (ev) {
            // 键入且有值时，隐藏校验提示
            if (type === "keyup") {
                this.pwdInvalid = false;
            }
            this.form.controls.password.updateValueAndValidity();
            this.form.controls.userName.updateValueAndValidity();
        }
    }

    // 更新验证码校验状态
    validateConfirmVerifyCode(ev, type?): void {
        if (ev) {
            // 键入且有值时，隐藏校验提示,刷新验证码后ev为空，保留校验提示不刷新
            if (type === "keyup") {
                this.vcFail = false;
                this.vcOverdue = false;
                this.pwdInvalid = false;
            }
            this.form.controls.verifyCode.updateValueAndValidity();
            this.form.controls.password.updateValueAndValidity();
            this.form.controls.userName.updateValueAndValidity();
        }
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInput.nativeElement.focus(); // 自动聚焦，延迟500ms适配ie8
        }, 500);
    }
    // 控制ie下placeholder显影
    placeholderControl(): void {
        if (testIE()) {
            this.phUsername = "";
            this.phPassword = "";
            this.phCode = "";
        }
    }
    getWrongTime() {
        const config = window.sessionStorage.getItem("ku-config");
        if (config) {
            this.lockTimes = JSON.parse(config);
        } else {
            this.authUser.getConfig().subscribe(data => {
                if (data) {
                    window.sessionStorage.setItem(
                        "ku-config",
                        JSON.stringify(data)
                    );
                    this.lockTimes = data["lockTimes"];
                } else {
                    this.lockTimes = 10;
                }
            });
        }
    }
    ngOnInit(): void {
        this.placeholderControl(); // 兼容ie浏览器将placeholder当value自动出现红框
        this.refreshVC(); // 获取、刷新验证码
        this.getWrongTime();
    }
}
