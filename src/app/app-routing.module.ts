import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { LoginComponent } from './login/login.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostPageComponent } from './post-page/post-page.component';

const routes: Routes = [
  {
    path: '', component: ClientLayoutComponent, pathMatch: 'full',
    children: [
      { path: '', component: PostListComponent },
      { path: 'post', component: PostPageComponent },
      { path: 'edit', component: PostEditComponent },
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent,
    children: [
      { path: 'home', component: AdminPageComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
