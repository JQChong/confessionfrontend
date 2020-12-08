import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  private baseUrlComments = 'http://localhost:8000/api/comments';

  getCommentsByPost(id: Number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlComments}/post/${id}`);
  }

  getCommentsByStatus(status: boolean): Observable<any> {
    const actualStatus = status ? 'True': 'False';
    return this.httpClient.get(`${this.baseUrlComments}/?approved=${actualStatus}`);
  }

  createComment(comment: object): Observable<object> {
    return this.httpClient.post(`${this.baseUrlComments}`, comment);
  }

  approveComment(id: Number): Observable<any> {
    return this.httpClient.patch(`${this.baseUrlComments}/${id}`, { approved: true });
  }

  deleteComment(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrlComments}/${id}`);
  }
}
