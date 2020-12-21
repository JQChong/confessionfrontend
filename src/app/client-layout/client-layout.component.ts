import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../model-service/category/category';
import { CategoryService } from '../model-service/category/category.service';
import { IconService } from '../model-service/icon.service';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.scss']
})
export class ClientLayoutComponent implements OnInit {
  opened!: boolean;
  smallScreen!: boolean;

  categories: Category[]

  constructor(
    private iconService: IconService,
    private breakpointObserver: BreakpointObserver,
    private categoryService: CategoryService,
    private router: Router
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
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      });
  }

  openSideNav() {
    this.opened = true;
  }

  closeSideNav() {
    this.opened = false;
  }

  onClick(category: string) {
    this.router.navigate(['home/post'], { queryParams: { category } });
  }
}
