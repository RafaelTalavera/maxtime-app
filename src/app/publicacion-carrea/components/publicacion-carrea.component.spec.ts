import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionCarreaComponent } from './publicacion-carrea.component';

describe('PublicacionCarreaComponent', () => {
  let component: PublicacionCarreaComponent;
  let fixture: ComponentFixture<PublicacionCarreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionCarreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicacionCarreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
