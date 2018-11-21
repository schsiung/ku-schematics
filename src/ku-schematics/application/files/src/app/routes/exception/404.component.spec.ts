import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { Exception404Component } from "./404.component";

describe("Exception404Component", () => {
    let component: Exception404Component;
    let fixture: ComponentFixture<Exception404Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            declarations: [Exception404Component]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Exception404Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
