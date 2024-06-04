import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanciasComponent } from './distancias.component';

describe('DistanciasComponent', () => {
  let component: DistanciasComponent;
  let fixture: ComponentFixture<DistanciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistanciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
