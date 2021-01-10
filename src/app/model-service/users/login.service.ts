/**
 * Credits: Nicholas Cristian Fernando, 29th NUSSU commIT Technical Director.
 * (Read: Jing Quan is lazy and plagiarized code from his codirector)
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';
import { Token } from './token';
import { catchError, map } from 'rxjs/operators';
import { ComponentBridgingService } from '../componentbridging.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private loginApiUrl = 'http://localhost:8000/api/token';
    private refreshApiUrl = 'http://localhost:8000/api/token/refresh';

    private currentUserSubject!: BehaviorSubject<User>;
    public currentUser!: Observable<User>;

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private bridgingService: ComponentBridgingService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    login(username: string, password: string) {
        return this.httpClient.post<Token>(this.loginApiUrl, { username, password })
            .pipe(
                map<Token, boolean>((token: Token) => {
                    this.storeUser({ username, token });
                    return true;
                }),
                catchError((error) => this.handleError(error))
            );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/admin/login']);
    }

    attachAccessToken(request: HttpRequest<any>): HttpRequest<any> {
        const user = this.user;
        if (user && user.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token.access}`
                }
            });
        }
        return request;
    }

    refreshAccessToken(): Observable<boolean> {
        return this.httpClient.post<Token>(this.refreshApiUrl, this.user.token)
            .pipe(
                map<Token, boolean>((receivedToken: Token) => {
                    this.updateAccessToken(receivedToken);
                    return true;
                }),
                catchError((error) => this.handleError(error))
            );
    }

    updateAccessToken(newToken: Token) {
        this.currentUserSubject.next({
            username: this.user.username,
            token: {
                access: newToken.access,
                refresh: this.user.token.refresh
            }
        })
    }

    get user(): User {
        return this.currentUserSubject.value;
    }

    private storeUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error(error.error.message);
            this.bridgingService.publish('error');
        } else {
            if (error.status === 400 || error.status === 401) {
                this.bridgingService.publish('authfail');
            } else {
                this.bridgingService.publish('error');
            }
        }
        return throwError("");
    }
}

