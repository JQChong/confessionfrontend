import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../model-service/category/category.service';
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

  allCategories = [];
  confessionForm: FormGroup;


  constructor(
    private categoryService: CategoryService,
    private postService: PostService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.confessionForm = new FormGroup({
      text: new FormControl()
    });
    this.categoryService.getCategories().subscribe(
      data => {
        this.allCategories = data;
        this.allCategories.forEach(
          category => this.confessionForm.addControl(String(category.name), new FormControl())
        );
      },
      error => {
        console.log(error);
      }
    );
    console.log(this.confessionForm)
  }

  isPostValid(): boolean {
    const text = this.confessionForm.controls['text'].value;
    return text != null && text.trim() != "";
  }

  onSubmit(): void {
    if (!this.isPostValid()) {
      return;
    }
    const post = this.getPost();
    this.postService.createPost(post).subscribe();
    this.confessionForm.reset();
    this.dialog.open(SubmitPostComponent);
  }

  getPost(): Post {
    const text = this.confessionForm.controls['text'].value;
    const post = new Post();
    // post.id automatically increment by somewhere (idk where), will overwrite value here
    post.text = text;
    post.likes = 0;
    post.time_created = new Date();
    const categories = [];
    for (let i = 0; i < this.allCategories.length; i++) {
      const category = this.allCategories[i];
      if (this.confessionForm.controls[category.name].value) {
        categories.push(i + 1); // database is 1-indexed...
      }
    }
    post.category = categories;
    return post;
  }

}

@Component({
  selector: 'submit-post',
  templateUrl: 'submit-post-dialog.html',
})
export class SubmitPostComponent {

}