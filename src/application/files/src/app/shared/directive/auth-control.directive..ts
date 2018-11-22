import { AuthGuard } from "../../core/services/auth-guard.service";
import {
    Directive,
    OnInit,
    Input,
    ElementRef,
    ViewContainerRef,
    TemplateRef,
    Renderer2
} from "@angular/core";

@Directive({
    selector: "[kuAuthControl]"
})
export class AuthControlDirective implements OnInit {
    private _operateCode: string;
    private _control: string;
    @Input("kuAuthControl") _operate: object;
    private hasView = false;
    constructor(
        private el: ElementRef,
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private renderer: Renderer2,
        private service: AuthGuard
    ) {}
    private handleError(): void {
        // 存在未定义的属性
        for (const key in this._operate) {
            if (key !== "code" && key !== "control") {
                throw new Error("未定义的属性，限code|control");
            }
        }

        // 未绑定权限码
        if (!this._operateCode) {
            throw new Error("该资源未绑定权限码");
        }

        // 未设定control属性 (允许control不存在, 不重点提示)
        if (!this._control) {
            console.log(`提醒:未设定control属性,参考：hide | disabled`);
            return;
        }

        // control值未定义
        if (
            this._operateCode &&
            this._control &&
            this._control !== "hide" &&
            this._control !== "disabled"
        ) {
            throw new Error(`该control值未定义，限 hide | disabled`);
        }
    }

    private handleDisabled(): void {
        const item = this.viewContainer.createEmbeddedView(this.templateRef);
        if (!this.service.hasAuth(this._operateCode)) {
            this.renderer.setAttribute(item.rootNodes[0], "disabled", "true");
        }
    }

    private handleHide(): void {
        if (!this.service.hasAuth(this._operateCode) && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        } else if (this.service.hasAuth(this._operateCode) && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }
    }
    ngOnInit() {
        this._operateCode = this._operate["code"];
        this._control = this._operate["control"];

        this.handleError();

        if (this._control === "disabled") {
            this.handleDisabled();
        }
        if (this._control === "hide") {
            this.handleHide();
        }
    }
}
