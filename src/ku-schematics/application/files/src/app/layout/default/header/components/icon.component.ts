import { Component } from "@angular/core";

@Component({
    selector: "header-icon",
    template: `
  <nz-dropdown nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()">
    <div class="item" nz-dropdown>
    <i nz-icon type="appstore" theme="outline"></i>
    </div>
    <div nz-menu class="wd-xl animated jello">
      <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
        <div nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
          <div nz-col [nzSpan]="6">
          <i nz-icon type="calendar" theme="outline"></i>
            <small>Calendar</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="file" theme="outline"></i>
            <small>Files</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="cloud" theme="outline"></i>
            <small>Cloud</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="star" theme="outline"></i>
            <small>Star</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="team" theme="outline"></i>
            <small>Team</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="scan" theme="outline"></i>
            <small>QR</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="pay-circle" theme="outline"></i>
            <small>Pay</small>
          </div>
          <div nz-col [nzSpan]="6">
          <i nz-icon type="printer" theme="outline"></i>
            <small>Print</small>
          </div>
        </div>
      </nz-spin>
    </div>
  </nz-dropdown>
  `
})
export class HeaderIconComponent {
    loading = true;

    change() {
        setTimeout(() => (this.loading = false), 500);
    }
}
