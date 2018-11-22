import { FormControl } from "@angular/forms";
// 用户名校验
export function MatchUsernameReg(control: FormControl) {
    const tell = control.value;
    if (!/^[a-zA-Z0-9_]{1,40}$/.test(tell)) {
        return { nomatch: true };
    } else {
        return null;
    }
}
// 角色名校验
export function MatchRolenameReg(control: FormControl) {
    const tell = control.value;
    if (!/^[A-Za-z0-9_\u4e00-\u9fa5]{2,16}$/.test(tell)) {
        return { nomatch: true };
    } else {
        return null;
    }
}
let pwd1: string;
let pwd2: string;
// 密码格式校验
export function MatchPasswordReg(control: FormControl) {
    const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{8,64}$/;
    pwd1 = control.value;
    if (!control.value) {
        return { required: true };
    } else if (!PASSWORD.test(control.value)) {
        return { error: true, password: true };
    } else {
        return null;
    }
}
// 显示名校验
export function MatchDisplayNameReg(control: FormControl) {
    let value = "" + control.value;
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    if (!value) {
        return { required: true };
    } else if (value.length > 40) {
        return { overLength: true };
    } else {
        return null;
    }
}
// 密码一致性校验
export function MatchPasswordEquar(control: FormControl) {
    pwd2 = control.value;
    if (!control.value) {
        return { required: true, error: true };
    } else if (pwd2 !== pwd1) {
        return { confirm: true, error: true };
    } else {
        return null;
    }
}

// 旧代码，待改
export function checkPasswordStrength(control: FormControl) {
    // pwd1 = "" + control.value;
    // if (!control) return null;
    // const self: any = this;
    // self.visible = !!control.value;
    // if (control.value && control.value.length > 9) self.status = "ok";
    // else if (control.value && control.value.length > 5) self.status = "pass";
    // else self.status = "pool";
    // if (self.visible)
    //     self.progress =
    //         control.value.length * 10 > 100 ? 100 : control.value.length * 10;
}
// 转义
export function htmlEscape(text: string) {
    let str: string;
    if (text) {
        str = encodeURIComponent(text);
        return str;
    } else {
        return text;
    }
}
