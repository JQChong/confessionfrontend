import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../model-service/post/post.service';
import { CommentService } from '../model-service/comment/comment.service';
import { SubmitCommentComponent } from './submit-comment/submit-comment.component';
import { Post } from '../model-service/post/post';
import { Comment } from '../model-service/comment/comment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';


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
   * 
   * addendum 2: preferably, disable the navigation buttons if there are no previous or next posts.
   * very not nice if i press previous post and then i get sent to 404 page haha
   */

  post: Post;
  comments: Comment[];
  commentForm: FormGroup;
  numberOfApprovedPosts: number;
  posters: string[];
  filteredPosters: Observable<string[]>;
  isPostLikeActive: Boolean = false;
  bigScreen: Boolean;
  nextPage: number = 2;
  isNextPage: boolean = false;
  postId: number;

  constructor(
    private _postService: PostService,
    private _commentService: CommentService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _breakpointObserver: BreakpointObserver,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.reloadData();

    this._breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        this.bigScreen = state.matches;
      });

    this.commentForm = this._fb.group({
      text: ['', Validators.required],
      poster: ['', Validators.required],
      name: ['', '']
    });

    this.commentForm.get('name').disable();
    this.commentForm.get('poster').valueChanges
      .subscribe((data: string) => { this.onPosterOptionChange(data); });

    this._postService.getPostByStatus()
      .subscribe(data => { 
        this.numberOfApprovedPosts = data.count;
       });

    this.filteredPosters = this.commentForm.get('text').valueChanges.pipe(
      startWith(''),
      map(value => value.includes('@') ? this.filter(value) : [])
    );
  }

  reloadData() {
    // this is an antipattern. don't do this!!!
    /*this.route.queryParams.subscribe((params: Params) => {
      const postId = Number(params['id']);
      this._postService.getPostById(postId).subscribe((post) => { this.post = post; }); // get post id from where?
      this._commentService.getCommentsByPost(postId).subscribe((comments) => { this.comments = comments.results; });
    });*/

    // do this!
    this._route.queryParams.pipe(
      map(params => Number(params['id'])),
      switchMap((postId) => {
        this.postId = postId;
        const post$ = this._postService.getPostById(postId)
        const comments$ = this._commentService.getCommentsByPost(postId)

        // combine and extract the data
        return zip(post$, comments$).pipe(map(([post, comments]) => ({ post, comments })));
      })
    ).subscribe(
      ({ post, comments }) => {
        if (post.approved) {
          this.post = post;
        } else {
          this._router.navigate(['/pageNotFound']);
        }
        this.comments = comments.results;
        this.isNextPage = comments.next !== null ? true : false;
        this.posters = this.getPosters();
      },
      (err) => {
        this._router.navigate(['/pageNotFound']);
        console.log(err);
      })
  }

  goPrevious(directives: FormGroupDirective) {
    let previousId = (this.post.id - 1) <= 0 ? this.numberOfApprovedPosts : this.post.id - 1;
    this.resetCommentForm(directives);
    this.nextPage = 2;
    this.isNextPage = false;
    this.isPostLikeActive = false;
    this._router.navigate(['./'],
      {
        relativeTo: this._route,
        queryParams: { id: previousId }
      });
  }

  goNext(directives: FormGroupDirective) {
    let nextId = (this.post.id + 1) >= this.numberOfApprovedPosts ? 1 : this.post.id + 1;
    this.resetCommentForm(directives);
    this.nextPage = 2;
    this.isNextPage = false;
    this.isPostLikeActive = false;
    this._router.navigate(['./'],
      {
        relativeTo: this._route,
        queryParams: { id: nextId }
      });
  }

  updatePostLikes() {
    if (this.isPostLikeActive) {
      this._postService.updateLikes(this.post.id, this.post.likes - 1)
        .subscribe(() => { 
          this.isPostLikeActive = !this.isPostLikeActive;
          this.reloadData(); });
    } else {
      this._postService.updateLikes(this.post.id, this.post.likes + 1)
        .subscribe(() => { 
          this.isPostLikeActive = !this.isPostLikeActive;
          this.reloadData(); });
    }
  }

  updateCommentLikes(comment: Comment) {
    this._commentService.updateLikes(comment.id, comment.likes + 1)
      .subscribe(() => { this.reloadData(); });
  }

  createNewComment(text: string, poster: string, directives: FormGroupDirective) {
    const numberOfAnonymousComments = this.getNumberOfAnonymousComments();
    const newComment = {
      post: this.post.id,
      text: text,
      poster: poster ? poster : 'Anonymous#' + (numberOfAnonymousComments + 1).toString(),
    }
    this._commentService.createComment(newComment)
      .subscribe(() => { 
        this._dialog.open(SubmitCommentComponent);
        this.resetCommentForm(directives); });
  }

  resetCommentForm(directives: FormGroupDirective) {
    directives.resetForm();
    this.commentForm.reset();
  }

  onPosterOptionChange(selectedValue: string) {
    const name = this.commentForm.get('name');
    if (selectedValue !== "Anonymous") {
      name.setValidators(Validators.required);
      name.enable();
    } else {
      name.clearValidators();
      name.setValue('');
      name.disable();
    }
    name.updateValueAndValidity();
  }

  getNumberOfAnonymousComments() {
    let res = 0;
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].poster.includes('Anonymous')) {
        res++;
      }
    }
    return res;
  }

  getPosters(): string[] {
    let res = [];
    for (let i = 0; i < this.comments.length; i++) {
      res.push(('@' + this.comments[i].poster));
    }
    return res;
  }

  filter(value: string): string[] {
    console.log(value);
    const filterValue = value.toLowerCase();
    return this.posters.filter(
      poster => poster.toLowerCase().includes(filterValue)
    )
  }

  loadMoreComments() {
    if (this.isNextPage) {
      this._commentService.getCommentsByPost(this.postId, this.nextPage)
        .subscribe(comments => {
          for (let comment of comments.results) {
            this.isNextPage = comments.next !== null ? true : false;
            this.nextPage++;
            this.comments.push(comment);
          }
        });
    }
  }
}