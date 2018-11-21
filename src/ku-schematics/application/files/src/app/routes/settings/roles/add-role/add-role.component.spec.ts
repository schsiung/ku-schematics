import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { CoreModule } from "@core/core.module";

import { SharedModule } from "@shared/shared.module";
import { AddRoleComponent } from "./add-role.component";

describe("AddRoleComponent", () => {
    let component: AddRoleComponent;
    let fixture: ComponentFixture<AddRoleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule, CoreModule],
            declarations: [AddRoleComponent],
            providers: [NzModalRef]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddRoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
