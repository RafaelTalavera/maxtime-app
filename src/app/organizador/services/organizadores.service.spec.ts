import { TestBed } from '@angular/core/testing';

import { OrganizadoresService } from './organizadores.service';

describe('OrganizadoresService', () => {
  let service: OrganizadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
