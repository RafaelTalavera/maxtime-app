import { TestBed } from '@angular/core/testing';

import { CorredorService } from './corredor.service';

describe('CorredorService', () => {
  let service: CorredorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorredorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
