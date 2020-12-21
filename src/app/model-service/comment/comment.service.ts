import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

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
