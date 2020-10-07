import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiPreTreatMenuComponent } from './di-pre-treat-menu.component';

describe('DiPreTreatMenuComponent', () => {
  let component: DiPreTreatMenuComponent;
  let fixture: ComponentFixture<DiPreTreatMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiPreTreatMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiPreTreatMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
