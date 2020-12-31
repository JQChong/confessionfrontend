import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseService } from '../base.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Post } from './post';
import { catchError, finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private httpClient: HttpClient,
    private baseService: BaseService
  ) {}

  // when url is confirmed, this needs to be moved to environment
  private baseUrlPosts = 'http://localhost:8000/api/posts';

  getPostById(id: Number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlPosts}/${id}`);
  }

  // i put in this default value so that u guys dun have to keep typing true lol
  getPostByStatus(status: string = 'True', page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlPosts, {
      page,
      approved: status,
    });
  }

  sortPosts(
    order_by: string,
    status: string = 'True',
    page: number = 1
  ): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlPosts, {
      order_by,
      page,
      approved: status,
    });
  }

  filterByCategory(
    category: string,
    order_by?: string,
    page: number = 1
  ): Observable<any> {
    let params = { category, page };
    if (order_by) {
      params = Object.assign(params, { order_by });
    }
    return this.baseService.getObjectByParams(this.baseUrlPosts, params);
  }

  searchPosts(search: string, page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlPosts, { search, approved: 'True', page });
  }

  createPost(post: object): Observable<object> {
    return this.baseService.createObject(this.baseUrlPosts, post);
  }

  approvePost(id: Number): Observable<any> {
    return this.baseService.approveObject(this.baseUrlPosts, id);
  }

  updateLikes(id: number, likes: number): Observable<any> {
    return this.baseService.updateLikes(this.baseUrlPosts, id, likes);
  }

  deletePost(id: Number): Observable<any> {
    return this.baseService.deleteObject(this.baseUrlPosts, id);
  }
}

// Replace MatTableDataSource with custom DataSource since we're using server side pagination
export class PostDataSource implements DataSource<Post> {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private postsLength = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public length$ = this.postsLength.asObservable()

  constructor(private postService: PostService) {}

  connect(collectionViewer: CollectionViewer): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.postsLength.complete
    this.postsSubject.complete();
    this.loadingSubject.complete();
  }

  loadPost(pageIndex: number) {
    this.loadingSubject.next(true);

    this.postService
      .getPostByStatus('False', pageIndex)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((posts) => {
        this.postsLength.next(posts.count)
        this.postsSubject.next(posts.results)
      });
  }
}
