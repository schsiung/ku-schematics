import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { Exception403Component } from "./403.component";

describe("Exception403Component", () => {
    let component: Exception403Component;
    let fixture: ComponentFixture<Exception403Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            declarations: [Exception403Component]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Exception403Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
