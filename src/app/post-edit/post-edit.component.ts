import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  confessionForm: FormGroup;

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.confessionForm = new FormGroup({
      text: new FormControl('')
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
    this.postService.createPost(post).subscribe();
    this.confessionForm.reset();
    this.openSnackBar();
  }

  getPost(): Post {
    const text = this.confessionForm.controls['text'].value;
    const post = new Post();
    // post.id automatically increment by somewhere (idk where), will overwrite value here
    post.text = text;
    post.likes = 0;
    post.time_created = new Date();
    post.approved = false;  // TODO make sure is false for production
    return post;
  }

  openSnackBar(): void {
    this.snackBar.openFromComponent(SubmittedComponent, {
      duration: 2000,
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
export class SubmittedComponent { }