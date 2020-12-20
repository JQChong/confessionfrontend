import { Component, OnInit } from '@angular/core';
import { PostService } from '../model-service/post/post.service';
import { CommentService } from '../model-service/comment/comment.service';
import { Comment } from '../model-service/comment/comment'
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  /**
   * Intended method: In this page, the post and the comments are loaded. You can just simply call
   * the methods and u are done lol. Details to be included are pretty much everything except post
   * id and comment id.
   * 
   * However, the page should also include a simple form for users to type in comments as well.
   * 
   * Users should be able to navigate between the posts as well, i.e. to the previous or next post.
   */

  post: any; // izit any?
  comments: any; // izit any?

  constructor(
    private _postService: PostService,
    private _commentService: CommentService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.post = this._postService.getPostById(this.post.id); // get post id from where?
    this.comments = this._commentService.getCommentsByPost(this.post.id);
  }

  goPrevious() {
    let previousId = this.post.id - 1;
    this._router.navigate(['home/post', previousId]); // is the route correct?
  }
  
  goNext() {
    let nextId = this.post.id + 1;
    this._router.navigate(['home/post', nextId]); // is the route correct?
  }

  updatePostLikes() {
    this._postService.updateLikes(this.post.id, this.post.likes).subscribe(); // subscribe need para?
  } 

  updateCommentLikes(comment: Comment) {
    this._commentService.updateLikes(comment.id, comment.likes).subscribe(); // subscribe need para?
  }

  createNewComment(text: string) {
    const newComment = {
      id: '',
      post: this.post,
      text: text,
      likes: 0,
      time_created: '',
      poster: '',
      approved: false} // is tis how to create new comment?
    this._commentService.createComment(newComment).subscribe(); // subscribe need para?
  }
  
}
