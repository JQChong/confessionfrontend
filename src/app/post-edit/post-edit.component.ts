import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    return text.trim() == "";
  }

  onSubmit(): void {
    const text = this.confessionForm.controls['text'].value;
    if (text == "") {
      return;
    }
    const post = this.getPost(text);
    this.postService.createPost(post).subscribe();
    this.confessionForm.reset();
    this.openSnackBar();
  }

  getPost(text: string): Post {
    const post = new Post();
    // post.id automatically increment by somewhere (idk where), will overwrite value here
    post.text = text;
    post.likes = 0;
    post.time_created = new Date();
    post.approved = false;
    return post;
  }

  openSnackBar(): void {
    this.snackBar.openFromComponent(SubmittedComponent, {
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