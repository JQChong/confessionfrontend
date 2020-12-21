import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private baseUrlComments = 'http://localhost:8000/api/category';

  getCategories(): Observable<any>{
    return this.httpClient.get(this.baseUrlComments);
  }
}
