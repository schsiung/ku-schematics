import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { CoreModule } from "@core/core.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { SharedModule } from "@shared/shared.module";
import { AddAccountComponent } from "./add-account.component";

describe("AddAccountComponent", () => {
    let component: AddAccountComponent;
    let fixture: ComponentFixture<AddAccountComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                RouterTestingModule,
                NoopAnimationsModule,
                SharedModule,
                CoreModule
            ],
            declarations: [AddAccountComponent],
            providers: [NzModalRef]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
