import { Component } from "@angular/core";

@Component({
    selector: "exception-500",
    templateUrl: "./500.component.html",
    styleUrls: ["./exception.component.less"]
})
export class Exception500Component {
    goBack() {
        window.history.go(-1);
    }
}
