import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../model-service/users/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  public loginStatus: BehaviorSubject<boolean>;

  constructor(
    private loginService: LoginService,
  ) {
    this.loginStatus = new BehaviorSubject<boolean>(false);
    this.loginService.currentUser.subscribe({
      next: (user) => this.loginStatus.next(user != null)
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.loginService.logout();
  }

}
