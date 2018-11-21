import { Component, HostListener, HostBinding } from "@angular/core";
import * as screenfull from "screenfull";

@Component({
    selector: "header-fullscreen",
    template: `
  <div>
    <i class="anticon anticon-{{status ? 'shrink' : 'arrows-alt'}}"></i>
    {{status ? '退出全屏' : '全屏'}}
  <div>
  `
})
export class HeaderFullScreenComponent {
    status = false;
    @HostListener("window:resize")
    _resize() {
        this.status = screenfull.isFullscreen;
    }
    @HostListener("click")
    _click() {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }
}
