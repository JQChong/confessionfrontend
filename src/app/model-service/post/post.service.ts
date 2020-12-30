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

  getPostById(id: Number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlPosts}/${id}`);
  }

  // i put in this default value so that u guys dun have to keep typing true lol
  getPostByStatus(status: string = 'True', page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlPosts, { page, approved: status });
  }

  sortPosts(order_by: string, status: string = 'True', page: number = 1): Observable<any> {
    return this.baseService.getObjectByParams(this.baseUrlPosts, { order_by, page, approved: status });
  }

  filterByCategory(category: string, order_by?: string, page: number = 1): Observable<any> {
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
