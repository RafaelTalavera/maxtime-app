import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDistanciaComponent } from './form-distancia.component';

describe('FormDistanciaComponent', () => {
  let component: FormDistanciaComponent;
  let fixture: ComponentFixture<FormDistanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDistanciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDistanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
