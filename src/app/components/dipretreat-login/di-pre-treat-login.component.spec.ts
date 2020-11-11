import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiPreTreatLoginComponent } from './di-pre-treat-login.component';

describe('DiPreTreatLoginComponent', () => {
  let component: DiPreTreatLoginComponent;
  let fixture: ComponentFixture<DiPreTreatLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiPreTreatLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiPreTreatLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
