import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  /**
   * Intended method: each post will be presented as material design cards. Details to be included are
   * post id, post content (i.e. text), likes and number of comments. Comments are not loaded in this page.
   * To minimize clutter, pagination should also be included. Will confirm with regards to purging old
   * confessions.
   * 
   * When a card is clicked, the user is redirected to the page with the post and the comments. This can be
   * done using the navigate method in Router class. During navigation, post id should also be passed as query
   * parameters so that relevant comments can be loaded at the page.
  */

  constructor() { }

  ngOnInit(): void {
  }

}
