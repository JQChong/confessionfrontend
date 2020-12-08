import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  private baseUrlPosts = 'http://localhost:8000/api/posts';

  getPostList(): Observable<any> {
    return this.httpClient.get(`${this.baseUrlPosts}`);
  }

  getPostById(id: Number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlPosts}/${id}`);
  }

  createPost(post: object): Observable<object> {
    return this.httpClient.post(`${this.baseUrlPosts}`, post);
  }

  deletePost(id: Number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrlPosts}/${id}`);
  }
}
