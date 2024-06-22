import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSMSComponent } from './login-sms.component';

describe('LoginSMSComponent', () => {
  let component: LoginSMSComponent;
  let fixture: ComponentFixture<LoginSMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSMSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
