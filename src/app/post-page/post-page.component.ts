import { Component, OnInit } from '@angular/core';
import { PostService } from '../model-service/post/post.service';
import { CommentService } from '../model-service/comment/comment.service';
import { Comment } from '../model-service/comment/comment'
import { ActivatedRoute, Params, Router } from '@angular/router';

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
  comments: Comment[]; // izit any?

  constructor(
    private _postService: PostService,
    private _commentService: CommentService,
    private route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const postId = Number(params['id']);
      this._postService.getPostById(postId).subscribe((post) => { this.post = post; }); // get post id from where?
      this._commentService.getCommentsByPost(postId).subscribe((comments) => { this.comments = comments.results; });
    });
  }

  goPrevious() {
    let previousId = this.post.id - 1;
    this._router.navigate(['home/post'], { queryParams: { id: previousId }}); // is the route correct?
  }

  goNext() {
    let nextId = this.post.id + 1;
    this._router.navigate(['home/post'], { queryParams: { id: nextId }}); // is the route correct?
  }

  updatePostLikes() {
    this._postService.updateLikes(this.post.id, this.post.likes + 1).subscribe(); // subscribe need para?
  }

  updateCommentLikes(comment: Comment) {
    this._commentService.updateLikes(comment.id, comment.likes).subscribe(); // subscribe need para?
  }

  createNewComment(text: string) {
    const newComment = {
      post: this.post.id,
      text: text
    } // is tis how to create new comment?
    this._commentService.createComment(newComment).subscribe(); // subscribe need para?
  }

}
