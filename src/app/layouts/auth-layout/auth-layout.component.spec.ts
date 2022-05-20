import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TabsModule } from "ngx-bootstrap/tabs";
import { AuthLayoutComponent } from "./auth-layout.component";


fdescribe("AuthLayoutComponent", () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;
 
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLayoutComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
      ] ,
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLayoutComponent);
 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("AuthLayoutComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });
});
