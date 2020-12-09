import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private httpClient: HttpClient,
    private baseService: BaseService
  ) { }

  // when url is confirmed, this needs to be moved to environment
  private baseUrlPosts = 'http://localhost:8000/api/posts';

  getPostList(): Observable<any> {
    return this.httpClient.get(`${this.baseUrlPosts}`);
  }

  getPostById(id: Number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlPosts}/${id}`);
  }

  getPostByStatus(status: boolean): Observable<any> {
    return this.baseService.getObjectByStatus(this.baseUrlPosts, status);
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
