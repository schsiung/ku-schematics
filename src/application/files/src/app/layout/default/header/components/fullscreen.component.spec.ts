import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { HeaderFullScreenComponent } from "./fullscreen.component";

describe("FullscreenComponent", () => {
    let component: HeaderFullScreenComponent;
    let fixture: ComponentFixture<HeaderFullScreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            declarations: [HeaderFullScreenComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderFullScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
