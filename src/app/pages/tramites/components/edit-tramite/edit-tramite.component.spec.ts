import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTramiteComponent } from './edit-tramite.component';

describe('EditTramiteComponent', () => {
  let component: EditTramiteComponent;
  let fixture: ComponentFixture<EditTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTramiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
