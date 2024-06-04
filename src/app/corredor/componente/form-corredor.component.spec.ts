import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCorredorComponent } from './form-corredor/form-corredor.component';



describe('FormCorredorComponent', () => {
  let component: FormCorredorComponent;
  let fixture: ComponentFixture<FormCorredorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCorredorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCorredorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
