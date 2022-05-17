import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUserComponent } from './crear-user.component';

describe('CrearUserComponent', () => {
  let component: CrearUserComponent;
  let fixture: ComponentFixture<CrearUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
