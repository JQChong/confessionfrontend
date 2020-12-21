import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private httpClient: HttpClient,
    private baseService: BaseService
  ) { }

  // when url is confirmed, this needs to be moved to environment
  private baseUrlComments = 'http://localhost:8000/api/comments';

  getCommentsByPost(id: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlComments}`, { params: { post_id: id + '' } });
  }

  getCommentsByStatus(status: boolean): Observable<any> {
    return this.baseService.getObjectByStatus(this.baseUrlComments, status);
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
