import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { CoreModule } from "@core/core.module";

import { SharedModule } from "@shared/shared.module";
import { ViewRoleComponent } from "./view-role.component";
import { AuthSettingService } from "../../auth-setting.service";

describe("ViewRoleComponent", () => {
    let component: ViewRoleComponent;
    let fixture: ComponentFixture<ViewRoleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule, CoreModule],
            providers: [NzModalRef, NzModalService, AuthSettingService],
            declarations: [ViewRoleComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewRoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
