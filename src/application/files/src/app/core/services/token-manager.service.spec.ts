import { TestBed, inject } from "@angular/core/testing";
import { SessionStorageStore } from "@ku/auth";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { TokenManagerService } from "./token-manager.service";

describe("TokenManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            providers: [SessionStorageStore, TokenManagerService]
        });
    });

    it(
        "should be created",
        inject([TokenManagerService], (service: TokenManagerService) => {
            expect(service).toBeTruthy();
        })
    );
});
