import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CoreModule } from "@core/core.module";
import { ACLService, SessionStorageStore } from "@ku/auth";

import { SharedModule } from "@shared/shared.module";
import { HeaderUserComponent } from "./user.component";

describe("UserComponent", () => {
    let component: HeaderUserComponent;
    let fixture: ComponentFixture<HeaderUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule, CoreModule],
            declarations: [HeaderUserComponent],
            providers: [ACLService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
