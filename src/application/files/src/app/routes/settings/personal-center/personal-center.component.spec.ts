import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CoreModule } from "@core/core.module";

import { SharedModule } from "@shared/shared.module";
import { PersonalCenterComponent } from "./personal-center.component";

describe("PersonalCenterComponent", () => {
    let component: PersonalCenterComponent;
    let fixture: ComponentFixture<PersonalCenterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule, CoreModule],
            declarations: [PersonalCenterComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PersonalCenterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
