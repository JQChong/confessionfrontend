import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from '../model-service/post/post';
import { Comment } from '../model-service/comment/comment';
import { PostService } from '../model-service/post/post.service';
import { CommentService } from '../model-service/comment/comment.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  /**
   * Intended method: Include two lists/tables (your choice), one is for unapproved posts, the other is for
   * unapproved comments. Admin should be able to approve a post in minimal moves, e.g. within 2 clicks.
   */
  posts = new MatTableDataSource<Post>();
  comments = new MatTableDataSource<Comment>();

  postTableColumns: string[] = ['id', 'text', 'time_created', 'approved'];
  commentTableColumns: string[] = [
    'id',
    'post',
    'text',
    'time_created',
    'approved',
  ];

  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.postService.getPostByStatus(false).subscribe((data: Post[]) => {
      console.log(data)
      this.posts.data = data.results
    })
    this.commentService.getCommentsByStatus(false).subscribe((data: Comment[]) => {
      this.comments.data = data.results
    })

    // Mock data
    // this.posts.data = [
    //   {
    //     id: 1,
    //     text: 'test',
    //     likes: 10,
    //     time_created: new Date(),
    //     approved: false,
    //   },
    //   {
    //     id: 2,
    //     text: 'test2',
    //     likes: 10,
    //     time_created: new Date(),
    //     approved: false,
    //   },
    // ];
    // this.comments.data = [
    //   {
    //     id: 1,
    //     post: this.posts.data[0],
    //     text: 'testComment',
    //     likes: 10,
    //     time_created: new Date(),
    //     poster: 'test',
    //     approved: false,
    //   },
    //   {
    //     id: 2,
    //     post: this.posts.data[1],
    //     text: 'testComment2',
    //     likes: 10,
    //     time_created: new Date(),
    //     poster: 'test2',
    //     approved: false,
    //   },
    // ];
  }

  updateState(type: 'Comment' | 'Post', state: Boolean, id: number): void {
    console.log('Type', type, 'State', state, 'Id', id);
    if (type === 'Post') {
      if (state) {
        this.postService.approvePost(id).subscribe();
      } else {
        this.postService.deletePost(id).subscribe();
      }
      this.posts.data = this.posts.data.filter(comment=>comment.id!==id)
    } else if (type === 'Comment') {
      if (state) {
        this.commentService.approveComment(id).subscribe();
      } else {
        this.commentService.deleteComment(id).subscribe();
      }
      this.comments.data = this.comments.data.filter(comment=>comment.id!==id)
    } else {
      throw new Error('Wrong type')
    }
  }
}
