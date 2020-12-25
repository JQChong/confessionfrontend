import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../model-service/post/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  /**
   * Intended method: each post will be presented as material design cards. Details to be included are
   * post id, post content (i.e. text), time, likes and number of comments. Comments are not loaded in
   * this page. To minimize clutter, pagination should also be included. Will confirm with regards to
   * purging old confessions.
   * 
   * When a card is clicked, the user is redirected to the page with the post and the comments. This can be
   * done using the navigate method in Router class. During navigation, post id should also be passed as query
   * parameters so that relevant comments can be loaded at the page.
   * 
   * addendum: users should also be able to filter the posts by category. for this, users will be clicking
   * on the categories on the side panel. then user will be redirected, together with the category as one of
   * the query parameters.
  */

  cards = [];
  currentPage = 1;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.populateCards();
  }

  populateCards(): void {
    this.cards = [];
    this.postService.getPostByStatus('True', this.currentPage).subscribe(
      data => {
        console.log(data); // TODO comment out for production
        for (let post of data.results) {
          this.cards.push({
            id: post.id,
            preview: this.getPreview(post.text),
            likes: post.likes,
            date: this.getDisplayDate(post.time_created)
          });
        }
      },
      error => {
        console.log("page out of range, revert to previous page");
        this.currentPage -= 1;
        this.populateCards();
        this.snackBar.openFromComponent(LastPageComponent, {
          duration: 4000,
        });
      }
    );
  }

  getPreview(text: string): string {
    const maxPreviewLength = 100;
    if (text.length < maxPreviewLength) {
      return text;
    } else {
      return text.slice(0, maxPreviewLength) + " ...";
    }
  }

  getDisplayDate(date: Date): string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date, format, locale);
  }

  isFirstPage(): boolean {
    return this.currentPage == 1;
  }

  isLastPage(): boolean {
    /** 
     * TODO need a method to check whether is last page efficiently
     * for example query total number of posts and max number of posts per page
     * then can calculate whether is last page
     */
    // THE FOLLOWING CAUSES INIFINITE LOOP SMH
    // const posts = this.postService.getPostByStatus('True', this.currentPage + 1);
    // let result = false;
    // posts.subscribe(
    //   data => { },
    //   error => {
    //     if (error['status'] == 404) {
    //       // next page not available, means already last page
    //       result = true;
    //     } else {
    //       console.log("unexpected error in isLastPage():", error);
    //     }
    //   }
    // );
    // return result;
    return false;
  }

  onPreviousClick(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.populateCards();
    }
  }

  onNextClick(): void {
    this.currentPage += 1;
    this.populateCards();
  }

}

@Component({
  selector: 'last-page-snack',
  templateUrl: 'last-page-snack.html',
  styles: [`
  .submitted {
    color: white;
  }
`],
})
export class LastPageComponent { }