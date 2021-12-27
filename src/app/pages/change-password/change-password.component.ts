import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  diferent:boolean = false;

  constructor(private authService: AuthService,private fb: FormBuilder,private router: Router) {}
  ngOnInit() {
    this.crearFormChangePassword()
  }

  crearFormChangePassword(){
    this.changePasswordForm = this.fb.group({
      oldPassword : new FormControl('',[Validators.required,Validators.minLength(6)]),
      newPassword : new FormControl('',[Validators.required,Validators.minLength(6)]),
      confirmedPassword : new FormControl('',[Validators.required,Validators.minLength(6)]),
    });
  }

  onChangePassword(){
    this.diferent=false;
    const formValue = this.changePasswordForm.value
    console.log( this.changePasswordForm.value);
    if(formValue.newPassword!==formValue.confirmedPassword){
      this.diferent=true;
      return;  
    }
    this.authService.changePassword(formValue).subscribe(
      (res)=>{
        if(res['message']=="Password change!"){
          this.router.navigate(['/dashboard']);
        } })
  }
 


}
