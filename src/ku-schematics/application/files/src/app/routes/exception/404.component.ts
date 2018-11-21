import { Component } from "@angular/core";

@Component({
    selector: "exception-404",
    templateUrl: "./404.component.html",
    styleUrls: ["./exception.component.less"]
})
export class Exception404Component {
    goBack() {
        window.history.go(-1);
    }
}
