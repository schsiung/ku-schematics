import { Component, HostListener } from "@angular/core";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { LocalStorageStore, SessionStorageStore } from "@ku/auth";

@Component({
    selector: "header-storage",
    template: `<a>
  <i class="anticon anticon-tool"></i>
  清除本地缓存</a>
  `,
    styles: [`:host /deep/ a{display:block;color:rgba(0, 0, 0, 0.65);}`]
})
export class HeaderStorageComponent {
    constructor(
        private confirmServ: NzModalService,
        private messageServ: NzMessageService,
        private sessionStorage: SessionStorageStore
    ) {}

    @HostListener("click")
    _click() {
        this.confirmServ.confirm({
            nzTitle: "是否清除缓存?",
            nzStyle: { top: "30%" },
            nzClosable: true,
            nzMask: true,
            nzMaskClosable: false,
            nzMaskStyle: { "background-color": "rgba(0, 0, 0, 0.3)" },
            nzOnOk: () => {
                window.sessionStorage.clear();
                this.messageServ.success("清除成功!");
            }
        });
    }
}
