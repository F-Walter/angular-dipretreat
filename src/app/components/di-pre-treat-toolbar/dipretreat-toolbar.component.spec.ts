import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DipretreatToolbarComponent } from './dipretreat-toolbar.component';

describe('DipretreatToolbarComponent', () => {
  let component: DipretreatToolbarComponent;
  let fixture: ComponentFixture<DipretreatToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DipretreatToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DipretreatToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
