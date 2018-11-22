import { Component } from "@angular/core";

@Component({
    selector: "exception-403",
    templateUrl: "./403.component.html",
    styleUrls: ["./exception.component.less"]
})
export class Exception403Component {
    goBack() {
        window.history.go(-2); // 上一个页面依然无权限，需返回2个页面
    }
}
