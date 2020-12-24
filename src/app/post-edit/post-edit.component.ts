import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.confessionForm = new FormGroup({
      text: new FormControl('')
    });
  }

  // TODO
  // consider changing return type if necessary
  onSubmit(): void {
    console.log("onSubmit()");
    const text = this.confessionForm.controls['text'].value;
    if (text == "") {
      return;
    }
    console.log("post text not empty");
    const post = new Post();
    post.id = 999;  // TODO get largest post id in database
    post.text = text;
    post.likes = 0;
    post.time_created = new Date();
    post.approved = true; // TODO change to false after debug
    this.postService.createPost(post).subscribe();
    // TODO submit confession
    // TODO snackbar inform submitted, clear form
  }

}
