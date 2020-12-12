import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentBridgingService } from '../model-service/componentbridging.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private service: ComponentBridgingService,
  ) { }

  ngOnInit(): void {
    this.service.publish('admin');
  }

  onSubmit(){
    // TODO: login
  }

}
