import { Component, OnInit } from "@angular/core";
import { SessionStorageStore } from "@ku/auth";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
    constructor(private storageService: SessionStorageStore) {}
    currentUser: string;
    ngOnInit() {
        this.currentUser = this.storageService.get("userInfo")["displayName"];
    }
}
