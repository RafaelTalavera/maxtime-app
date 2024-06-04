import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarreraComponent } from './form-carrera.component';

describe('FormCarreraComponent', () => {
  let component: FormCarreraComponent;
  let fixture: ComponentFixture<FormCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarreraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
