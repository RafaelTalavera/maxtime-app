import { TestBed } from '@angular/core/testing';

import { CarreasService } from './carreras.service';

describe('CarreasService', () => {
  let service: CarreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
