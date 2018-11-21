import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { Exception500Component } from "./500.component";

describe("500Component", () => {
    let component: Exception500Component;
    let fixture: ComponentFixture<Exception500Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            declarations: [Exception500Component]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Exception500Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
