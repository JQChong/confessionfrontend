import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  search = "";
  page = 1;
  isFirstPage = false;
  isLastPage = false;

  sortCriterion = new FormControl('-time_created');
  validOptions = ['-time_created', 'popular', '-likes']

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        return this.handleQuery(params);
      })
    ).subscribe(
      data => {
        console.log(data.results);
        this.cards = [];
        this.updateIsFirstPage();
        this.updateIsLastPage();
        if (data.results.length > 0) {
          this.populateCards(data);
        }
      },
      error => {
        console.log(error);
        // give time for back navigation, might need better way
        setTimeout(() => { this.router.navigate(["/home/404"]); }, 1000);
      }
    );
  }

  updateIsFirstPage(): void {
    this.isFirstPage = this.page === 1;
  }

  updateIsLastPage(): void {
    this.postService.searchPosts(this.search, this.page + 1).subscribe(
      data => {
        this.isLastPage = false // next page has data means not last page
      },
      error => {
        if (error['status'] == 404) {
          this.isLastPage = true; // next page not available, means already last page
        } else {
          console.log(error);
        }
      }
    );
  }

  handleQuery(params: Params): Observable<any> {
    console.log(params);
    this.search = params["search"];
    this.search = !this.search ? "" : String(this.search);
    this.page = params["page"];
    this.page = !this.page ? 1 : Number(this.page);
    let sort = params["order_by"];
    sort = this.validOptions.includes(sort) ? sort : '-time_created';
    this.sortCriterion.setValue(sort);
    console.log("search:", this.search, "page:", this.page);
    const posts = this.postService.sortPosts(sort, this.search, this.page);
    return posts;
  }

  resortList(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { order_by: this.sortCriterion.value },
      queryParamsHandling: 'merge',
      skipLocationChange: true
    })
  }

  populateCards(data: any): void {
    for (let post of data.results) {
      this.cards.push({
        id: post.id,
        preview: this.getPreview(post.text),
        likes: post.likes,
        date: this.getDisplayDate(post.time_created),
        categories: post.category // category is Category[] in post
      });
    }
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

  routeToPost(id: number): void {
    this.router.navigate(["/home/post"], { queryParams: { id } });
  }

  onPreviousClick(): void {
    if (this.page == 1) {
      return;
    }
    this.page -= 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge',
      skipLocationChange: true
    });
  }

  onNextClick(): void {
    this.page += 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge',
      skipLocationChange: true
    });
  }

}