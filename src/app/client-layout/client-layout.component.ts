import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { IconService } from '../model-service/icon.service';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.scss']
})
export class ClientLayoutComponent implements OnInit {
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
