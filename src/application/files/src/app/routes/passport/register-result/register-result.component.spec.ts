import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";

import { UserRegisterResultComponent } from "./register-result.component";

describe("RegisterResultComponent", () => {
    let component: UserRegisterResultComponent;
    let fixture: ComponentFixture<UserRegisterResultComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            declarations: [UserRegisterResultComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserRegisterResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
