import { TestBed, inject } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";

import { AppSettingService } from "./settings.service";

describe("SettingsService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [AppSettingService]
        });
    });

    xit(
        "should be created",
        inject([AppSettingService], (service: AppSettingService) => {
            expect(service).toBeTruthy();
        })
    );
});
