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
    return this.baseService.getObjectByParams(this.baseUrlComments, { page, post_id, approved: true });
  }

  getCommentsByStatus(status: boolean, page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlComments, { page, approved: status });
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
