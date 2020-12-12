import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  /**
   * Intended method: Include two lists/tables (your choice), one is for unapproved posts, the other is for
   * unapproved comments. Admin should be able to approve a post in minimal moves, e.g. within 2 clicks.
   */

  constructor() { }

  ngOnInit(): void {
  }

}
