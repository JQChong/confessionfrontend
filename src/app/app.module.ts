import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostListComponent } from './post-list/post-list.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PostPageComponent } from './post-page/post-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ComponentBridgingService } from './model-service/componentbridging.service';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SubmitCommentComponent } from './post-page/submit-comment/submit-comment.component';
import { SubmitPostComponent } from './post-edit/post-edit.component';
import { JwtInterceptor } from './api-auth/jwt.interceptor';
import { RefreshInterceptor } from './api-auth/refresh.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostEditComponent,
    LoginComponent,
    LogoutComponent,
    PostPageComponent,
    AdminPageComponent,
    AdminLayoutComponent,
    ClientLayoutComponent,
    NotFoundComponent,
    SubmitCommentComponent,
    SubmitPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
    ComponentBridgingService],
  bootstrap: [AppComponent],
})
export class AppModule { }
