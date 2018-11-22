import { TestBed, async, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { AuthGuard } from "./auth-guard.service";
import { AuthUserService } from "@core/services/auth-user.service";
import { TokenManagerService } from "@core/services/token-manager.service";

import { ACLService } from "@ku/auth";
import { SessionStorageStore } from "@ku/auth";
describe("AuthGuardServiceGuard", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            providers: [
                AuthGuard,
                AuthUserService,
                ACLService,
                TokenManagerService,
                SessionStorageStore
            ]
        });
    });

    it(
        "should create an instance...",
        inject([AuthGuard], (guard: AuthGuard) => {
            expect(guard).toBeTruthy();
        })
    );
});
