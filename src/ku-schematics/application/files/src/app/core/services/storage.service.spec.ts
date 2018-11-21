import { TestBed, inject } from "@angular/core/testing";
import { SessionStorageStore } from "@ku/auth";

import { StorageService } from "./storage.service";

describe("StorageService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SessionStorageStore, StorageService]
        });
    });

    it(
        "should be created",
        inject([StorageService], (service: StorageService) => {
            expect(service).toBeTruthy();
        })
    );
});
