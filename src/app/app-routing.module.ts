import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostPageComponent } from './post-page/post-page.component';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'edit', component: PostEditComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'post', component: PostPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
