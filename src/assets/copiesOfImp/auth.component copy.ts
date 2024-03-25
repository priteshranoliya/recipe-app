import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from '../../app/auth/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})


export class AuthComponent {
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  errorMsg:string = null;

  states = [
    {name: 'Arizona', abbrev: 'AZ'},
    {name: 'California', abbrev: 'CA'},
    {name: 'Colorado', abbrev: 'CO'},
    {name: 'New York', abbrev: 'NY'},
    {name: 'Pennsylvania', abbrev: 'PA'},
  ];
formStatus: any;


  constructor(private authService: AuthService,
              private route:Router){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form : NgForm){
    if(form.invalid){
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      this.isLoading = true;
      authObs = this.authService.login(email,password);
    }
    else{
      this.isLoading = true;
      authObs = this.authService.signup(email,password);
    }

    authObs.subscribe(
      resData => {
        console.log('Response data after login or signup is: ',resData);
        this.route.navigate(['/recipes']);
        this.isLoading = false;
      },
      errorMessage => {
        // console.log(errorRes.error.error.errors[0].message);
        console.log('error message is: ',errorMessage);
        this.errorMsg = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }


  onCloseAlert(){
    this.errorMsg = null;
  }

}
