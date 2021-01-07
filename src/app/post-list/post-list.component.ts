import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoryService } from '../model-service/category/category.service';
import { CommentService } from '../model-service/comment/comment.service';
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

  queryParams: Params;
  data: any;
  cards = [];
  private readonly postPerPage = 10;
  isFirstPage = false;
  isLastPage = false;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.route.queryParams.pipe(
      switchMap(queryParams => {
        // console.log("query:", queryParams);
        this.queryParams = JSON.parse(JSON.stringify(queryParams)); // make editable clone
        return this.handleQuery();
      })
    ).subscribe(
      data => {
        // console.log("data:", data);
        this.data = data;
        this.cards = [];
        this.updateIsFirstPage();
        this.updateIsLastPage();
        if (this.data.results.length > 0) {
          this.populateCards();
        }
      },
      error => {
        console.log(error);
        // just leave it as no results
      }
    );
  }

  handleQuery(): Observable<any> {
    if (this.queryParams["search"]) {
      return this.handleSearch();
    } else if (this.queryParams["category"]) {
      return this.handleCategory();
    } else {
      return this.postService.getPostByStatus("True", this.getPage());
    }
  }

  updateIsFirstPage(): void {
    this.isFirstPage = this.getPage() == 1;
  }

  updateIsLastPage(): void {
    this.isLastPage = this.getPage() * this.postPerPage >= this.data.count;
  }

  populateCards(): void {
    for (let post of this.data.results) {
      this.cards.push({
        id: post.id,
        preview: this.getPreview(post.text),
        likes: post.likes,
        comments: post.num_comments,
        date: post.time_created,
        categories: post.category
      })
    }
  }

  handleSearch(): Observable<any> {
    const search = this.queryParams["search"];
    return this.postService.searchPosts(search, this.getPage());
  }

  handleCategory(): Observable<any> {
    return this.getCategoryId().pipe(
      switchMap(id => {
        return this.postService.filterByCategory(String(id), "", this.getPage());
      })
    );
  }

  getPage(): number {
    const page = Number(this.queryParams["page"]);
    return page ? page : 1;
  }

  getPreview(text: string): string {
    const maxPreviewLength = 100;
    if (text.length < maxPreviewLength) {
      return text;
    } else {
      return text.slice(0, maxPreviewLength) + " ...";
    }
  }

  getCategoryId(): Observable<number> {
    const thisCategory = this.queryParams["category"];
    return this.categoryService.getCategories().pipe(
      map(categories => {
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          if (category.name == thisCategory) {
            return i + 1;
          }
        }
        return 0;
      })
    );
  }

  routeToPost(id: number): void {
    this.router.navigate(["/home/post"], { queryParams: { id } });
  }

  onPreviousClick(): void {
    const page = Number(this.queryParams["page"]);
    if (page && page > 1) {
      this.queryParams["page"] = page - 1;
      this.router.navigate(["/home"], { queryParams: this.queryParams });
    }
  }

  onNextClick(): void {
    let page = Number(this.queryParams["page"]);
    if (!page) {
      page = 1;
    }
    if (!this.isLastPage) {
      this.queryParams["page"] = page + 1;
      this.router.navigate(["/home"], { queryParams: this.queryParams });
    }
  }

}