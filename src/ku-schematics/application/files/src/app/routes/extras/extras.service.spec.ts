import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { SharedModule } from "@shared/shared.module";
import { ExtrasService } from "./extras.service";

describe("ExtrasService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule],
            providers: [ExtrasService]
        });
    });

    it(
        "should be created",
        inject([ExtrasService], (service: ExtrasService) => {
            expect(service).toBeTruthy();
        })
    );
});
