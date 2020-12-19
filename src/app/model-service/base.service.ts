import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor(private httpClient: HttpClient) { }

    getObjectByStatus(url: string, status: boolean): Observable<any> {
        const actualStatus = status ? 'True' : 'False';
        let params = new HttpParams().set('approved', actualStatus);
        return this.httpClient.get(`${url}`, { params });
    }

    createObject(url: string, post: object): Observable<object> {
        return this.httpClient.post(`${url}`, post);
    }

    approveObject(url: string, id: Number): Observable<any> {
        console.log("CALLED")
        return this.httpClient.patch(`${url}/${id}`, { params: { approved: true } });
    }

    updateLikes(url: string, id: number, likes: number): Observable<any> {
        return this.httpClient.patch(`${url}/${id}`, { params: { likes } });
    }

    deleteObject(url: string, id: Number): Observable<any> {
        return this.httpClient.delete(`${url}/${id}`);
    }
}