import { Component } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { SettingsService } from "@ku/ui";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html"
})
export class SidebarComponent {
    constructor(
        public settings: SettingsService,
        public msgSrv: NzMessageService
    ) {}
}
