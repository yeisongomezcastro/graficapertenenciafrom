import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosInicialesComponent } from './datos-iniciales.component';

describe('DatosInicialesComponent', () => {
  let component: DatosInicialesComponent;
  let fixture: ComponentFixture<DatosInicialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosInicialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosInicialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
