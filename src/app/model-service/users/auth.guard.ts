/**
 * Credits: Nicholas Cristian Fernando, 29th NUSSU commIT Technical Director.
 * (Read: Jing Quan is lazy and plagiarized code from his codirector)
 */

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LoginService } from "./login.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private loginService: LoginService
    ) { }

    canActivate() {
        if (this.loginService.user) {
            return true;
        }
        this.router.navigate(['/admin/login']);
        return false;
    }
}