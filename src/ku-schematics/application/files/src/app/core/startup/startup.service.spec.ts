import { TestBed, inject } from "@angular/core/testing";

import { StartupService } from "./startup.service";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { MenuService, SettingsService, TitleService } from "@ku/ui";
import { ACLService } from "@ku/auth";
import { SessionStorageStore } from "@ku/auth";
describe("StartupService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            providers: [
                MenuService,
                SettingsService,
                TitleService,
                ACLService,
                SessionStorageStore,
                StartupService
            ]
        });
    });

    it(
        "should be created",
        inject([StartupService], (service: StartupService) => {
            expect(service).toBeTruthy();
        })
    );
});
