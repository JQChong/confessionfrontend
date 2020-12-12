import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  /**
   * Intended method: In this page, the post and the comments are loaded. You can just simply call
   * the methods and u are done lol. Details to be included are pretty much everything except post
   * id and comment id.
   * 
   * However, the page should also include a simple form for users to type in comments as well.
   */

  constructor() { }

  ngOnInit(): void {
  }

}
