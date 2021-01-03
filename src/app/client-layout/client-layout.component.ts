import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
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

  thisYear: number;

  bottomClass: string;

  constructor(
    private iconService: IconService,
    private breakpointObserver: BreakpointObserver,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.iconService.registerIcons('instagram', './assets/instagram.svg');
    this.getScreenHeight();
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
    this.thisYear = new Date().getFullYear();
  }

  @HostListener('window:resize', ['$event'])
  getScreenHeight(event?){
    if(window.innerHeight<=412){
      this.bottomClass = 'bottomRelative';
    }else{
      this.bottomClass = 'bottomStick';
    }
  }

  openSideNav() {
    this.opened = true;
  }

  closeSideNav() {
    this.opened = false;
  }

  onClick(category: string) {
    this.router.navigate(['home'], { queryParams: { category } });
  }

  searchOnEnter(term: string) {
    if (term) {
      this.router.navigate(['home'], { queryParams: { search: term } });
    } else {
      this.router.navigate(['home']);
    }
  }
}
