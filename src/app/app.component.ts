import { Component, OnInit } from '@angular/core';
import { IconService } from './model-service/icon.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'confessionfrontend';
  opened!: boolean;
  smallScreen!: boolean;

  constructor(
    private iconService: IconService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.iconService.registerIcons('instagram', './assets/instagram.svg');
  }

  ngOnInit(): void {
    this.breakpointObserver
        .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
        .subscribe((state: BreakpointState) => {
          this.smallScreen = state.matches;
          this.opened = !state.matches;
        });
  }

  openSideNav() {
    this.opened = true;
  }

  closeSideNav() {
    this.opened = false;
  }
}
