import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private baseUrlComments = environment.apiUrl + 'category';

  getCategories(): Observable<any>{
    return this.httpClient.get(this.baseUrlComments);
  }
}
