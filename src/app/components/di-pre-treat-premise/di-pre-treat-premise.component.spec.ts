import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiPreTreatPremiseComponent } from './di-pre-treat-premise.component';

describe('DiPreTreatPremiseComponent', () => {
  let component: DiPreTreatPremiseComponent;
  let fixture: ComponentFixture<DiPreTreatPremiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiPreTreatPremiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiPreTreatPremiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
