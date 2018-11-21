import { TestBed, inject } from '@angular/core/testing';

import { SourceLicensingService } from './source-licensing.service';

describe('SourceLicensingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SourceLicensingService]
    });
  });

  it('should be created', inject([SourceLicensingService], (service: SourceLicensingService) => {
    expect(service).toBeTruthy();
  }));
});
