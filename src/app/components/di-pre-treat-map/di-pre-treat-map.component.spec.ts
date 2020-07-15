import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiPreTreatMapComponent } from './di-pre-treat-map.component';

describe('DiPreTreatMapComponent', () => {
  let component: DiPreTreatMapComponent;
  let fixture: ComponentFixture<DiPreTreatMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiPreTreatMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiPreTreatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
