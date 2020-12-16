import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComponentBridgingService } from '../model-service/componentbridging.service';
import { LoginService } from '../model-service/users/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  hide = true;

  errorString: string;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  errorSubscription: Subscription;
  authfailSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private bridgingService: ComponentBridgingService
  ) { }

  ngOnInit(): void {
    this.errorSubscription = this.bridgingService.on('error').subscribe(() => {this.setErrorString("An unknown error occured.")});
    this.authfailSubscription = this.bridgingService.on('authfail').subscribe(() => {this.setErrorString("Your username or password is incorrect.")});
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
    this.authfailSubscription.unsubscribe();
  }

  get form() {
    return this.loginForm.controls;
  }

  setErrorString(str: string) {
    this.errorString = str;
  }

  onSubmit(){
    this.loginService.login(this.form.username.value, this.form.password.value)
      .subscribe((status: boolean) => {
        if (status) {
          this.router.navigate(['/admin/home']);
        }
      });
  }

}
