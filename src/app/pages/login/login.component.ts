import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  constructor(private authService: AuthService,private fb: FormBuilder,private router: Router) {}

  ngOnInit() {
    this.crearFormularioLogin();
  }

  ngOnDestroy() {
    console.log('Se utilizo OnDestroy')
  }


  crearFormularioLogin(){
    this.loginForm = this.fb.group({
      username: new FormControl('',[Validators.required,Validators.email,Validators.minLength(6)]),
      password : new FormControl('',[Validators.required,Validators.minLength(6)]),
    });
  }

  onLogin(){
    const formValue= this.loginForm.value;
    console.log(formValue);
    this.authService.login(formValue).subscribe(
      (res)=>{
       if(res){
        console.log('Login Exitoso');
        console.log(res);
        localStorage.setItem('usuarioLogueado',formValue.username);
        this.router.navigate(['/dashboard']);
       }});
  }


}
