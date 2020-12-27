import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor(private httpClient: HttpClient) { }

    getObjectByParams(url: string, params): Observable<any> {
        return this.httpClient.get(`${url}`, { params });
    }

    createObject(url: string, post: object): Observable<object> {
        return this.httpClient.post(`${url}`, post);
    }

    approveObject(url: string, id: Number): Observable<any> {
        return this.httpClient.patch(`${url}/${id}`, { approved: true, time_created: new Date() });
    }

    updateLikes(url: string, id: number, likes: number): Observable<any> {
        return this.httpClient.patch(`${url}/${id}`, { likes });
    }

    deleteObject(url: string, id: Number): Observable<any> {
        return this.httpClient.delete(`${url}/${id}`);
    }
}