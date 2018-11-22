import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { AuthUserService } from "./auth-user.service";
import { ACLService, SessionStorageStore } from "@ku/auth";
import { TokenManagerService } from "@core/services/token-manager.service";
describe("AuthUserService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            providers: [
                ACLService,
                SessionStorageStore,
                TokenManagerService,
                AuthUserService
            ]
        });
    });

    it(
        "should be created",
        inject(
            [SessionStorageStore, AuthUserService],
            (service: AuthUserService) => {
                expect(service).toBeTruthy();
            }
        )
    );
    // tslint:disable-next-line:eofline
});
