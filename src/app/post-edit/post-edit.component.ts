import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { Category } from '../model-service/category/category';
import { Post } from '../model-service/post/post';
import { PostService } from '../model-service/post/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  /**
   * Intended method: Uh... it's a form, whaddaya expect???!! Though, if possible, include
   * captcha in the form
   */

  allCategories: Category[] = Category.CATEGORIES;
  confessionForm: FormGroup;

  configSuccess: MatSnackBarConfig = {
    panelClass: "style-success",
    duration: 10000,
    verticalPosition: "bottom"
  }

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.confessionForm = new FormGroup({
      text: new FormControl("")
    });
    this.allCategories.forEach(category => {
      this.confessionForm.addControl(category.name, new FormControl(false));
    });
  }

  isPostValid(): boolean {
    const text = this.confessionForm.controls['text'].value;
    return text.trim() != "";
  }

  onSubmit(): void {
    if (!this.isPostValid()) {
      return;
    }
    const post = this.getPost();
    console.log("postService.createPost with this post:", post);
    this.postService.createPost(post).subscribe();
    this.reset();
    this.openSnackBar();
  }

  getPost(): Post {
    const text = this.confessionForm.controls['text'].value;
    const post = new Post();
    // post.id automatically increment by somewhere (idk where), will overwrite value here
    post.text = text;
    post.likes = 0;
    post.time_created = new Date();
    post.approved = true;  // TODO make sure is false for production
    const categories: Category[] = [];
    this.allCategories.forEach(category => {
      if (this.confessionForm.controls[category.name].value) {
        categories.push(category);
      }
    });
    post.category = categories; // category is Category[] in post
    return post;
  }

  reset(): void {
    this.confessionForm.reset();
  }

  openSnackBar(): void {
    this.snackBar.openFromComponent(SubmittedComponent, {
      ...this.configSuccess
    });
  }

}

@Component({
  selector: 'submitted-snack',
  templateUrl: 'submitted-snack.html',
  styles: [`
    .submitted {
      color: white;
    }
  `],
})
export class SubmittedComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SubmittedComponent>
  ) { }
}