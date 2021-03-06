import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { LayoutFullScreenComponent } from "./fullscreen.component";

describe("FullscreenComponent", () => {
    let component: LayoutFullScreenComponent;
    let fixture: ComponentFixture<LayoutFullScreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            declarations: [LayoutFullScreenComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutFullScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
