import { Component, OnInit } from "@angular/core";
import { AuthUserService } from "../../../core/services/auth-user.service";
import { AddAccountComponent } from "../account/add-account/add-account.component";

@Component({
    selector: "app-personal-center",
    templateUrl: "./personal-center.component.html",
    styleUrls: ["./personal-center.component.less"]
})
export class PersonalCenterComponent implements OnInit {
    constructor(private authUser: AuthUserService) {}
    currentId: number = this.authUser.currentUser.id;

    ngOnInit() {}
}
