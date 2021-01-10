import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  PostDataSource,
  PostService,
} from '../model-service/post/post.service';
import {
  CommentService,
  CommentDataSource,
} from '../model-service/comment/comment.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements AfterViewInit, OnInit {
  /**
   * Intended method: Include two lists/tables (your choice), one is for unapproved posts, the other is for
   * unapproved comments. Admin should be able to approve a post in minimal moves, e.g. within 2 clicks.
   */

  posts: PostDataSource;
  comments: CommentDataSource;

  postTableColumns: string[] = ['id', 'text', 'time_created', 'action'];
  commentTableColumns: string[] = [
    'id',
    'post',
    'text',
    'poster',
    'time_created',
    'action',
  ];

  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) {}

  @ViewChild('PostsPaginator') postsPaginator: MatPaginator;
  @ViewChild('CommentsPaginator') commentsPaginator: MatPaginator;

  ngOnInit(): void {
    this.posts = new PostDataSource(this.postService);
    this.posts.loadPost(1);
    this.comments = new CommentDataSource(this.commentService);
    this.comments.loadComment(1);
  }

  ngAfterViewInit() {
    this.postsPaginator.page
      .pipe(tap(() => this.loadPostPage('GET')))
      .subscribe();
    this.commentsPaginator.page
      .pipe(tap(() => this.loadCommentPage('GET')))
      .subscribe();
  }

  loadPostPage(status: 'GET' | 'UPDATE') {
    if (status === 'UPDATE') {
      const currentLength = this.postsPaginator.length - 1;
      if (
        currentLength / 10 === this.postsPaginator.pageIndex &&
        currentLength !== 0
      ) {
        return this.postsPaginator.previousPage();
      }
    }
    return this.posts.loadPost(this.postsPaginator.pageIndex + 1);
  }

  loadCommentPage(status: 'GET' | 'UPDATE') {
    if (status === 'UPDATE') {
      const currentLength = this.commentsPaginator.length - 1;
      if (
        currentLength / 10 === this.commentsPaginator.pageIndex &&
        currentLength !== 0
      ) {
        return this.commentsPaginator.previousPage();
      }
    }
    return this.comments.loadComment(this.commentsPaginator.pageIndex + 1);
  }

  updateState(type: 'Comment' | 'Post', state: Boolean, id: number): void {
    console.log('Type', type, 'State', state, 'Id', id);
    if (type === 'Post') {
      if (state) {
        this.postService
          .approvePost(id)
          .subscribe(() => this.loadPostPage('UPDATE'));
      } else {
        this.postService
          .deletePost(id)
          .subscribe(() => this.loadPostPage('UPDATE'));
      }
    } else if (type === 'Comment') {
      if (state) {
        this.commentService
          .approveComment(id)
          .subscribe(() => this.loadCommentPage('UPDATE'));
      } else {
        this.commentService
          .deleteComment(id)
          .subscribe(() => this.loadCommentPage('UPDATE'));
      }
    } else {
      throw new Error('Wrong type');
    }
  }
}
