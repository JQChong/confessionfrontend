import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseService } from '../base.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Comment } from './comment';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private baseService: BaseService
  ) { }

  // when url is confirmed, this needs to be moved to environment
  private baseUrlComments = 'http://localhost:8000/api/comments';

  // note that only approved posts will be shown.
  getCommentsByPost(post_id: number, page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlComments, { page, post_id, approved: 'True' });
  }

  getCommentsByStatus(status: string = 'True', page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlComments, { page, approved: status });
  }

  sortCommentsWithinPost(order_by: string, post_id: number, page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlComments, { order_by, post_id, page, approved: 'True' });
  }

  // i would presume this to be only used for admin page
  sortComments(order_by: string, page: number = 1, status: string = 'False'): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlComments, { order_by, page, approved: status });
  }

  createComment(comment: object): Observable<object> {
    return this.baseService.createObject(this.baseUrlComments, comment);
  }

  approveComment(id: number): Observable<any> {
    return this.baseService.approveObject(this.baseUrlComments, id);
  }

  updateLikes(id: number, likes: number): Observable<any> {
    return this.baseService.updateLikes(this.baseUrlComments, id, likes);
  }

  deleteComment(id: number): Observable<any> {
    return this.baseService.deleteObject(this.baseUrlComments, id);
  }
}

// Replace MatTableDataSource with custom DataSource since we're using server side pagination
export class CommentDataSource implements DataSource<Comment> {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  private commentsLength = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public length$ = this.commentsLength.asObservable()

  constructor(private commentService: CommentService) {}

  connect(collectionViewer: CollectionViewer): Observable<Comment[]> {
    return this.commentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.commentsLength.complete()
    this.commentsSubject.complete();
    this.loadingSubject.complete();
  }

  loadComment(pageIndex: number) {
    this.loadingSubject.next(true);

    this.commentService
      .getCommentsByStatus('False', pageIndex)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((comments) => {
        this.commentsLength.next(comments.count)
        this.commentsSubject.next(comments.results)
      });
  }
}