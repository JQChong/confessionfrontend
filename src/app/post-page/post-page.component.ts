import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../model-service/post/post.service';
import { CommentService } from '../model-service/comment/comment.service';
import { SubmitCommentComponent } from './submit-comment/submit-comment.component';
import { Post } from '../model-service/post/post';
import { Comment } from '../model-service/comment/comment';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

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
  posters: string[];
  filteredPosters: Observable<string[]>;
  valueBeforeChange: string;
  isPostLikeActive: boolean = false;
  smallScreen: boolean;
  nextPage: number = 2;
  hasNextPage: boolean = false;
  postId: number;
  prevId: number;
  nextId: number;
  cursorPosition: number;

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
      .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        this.smallScreen = state.matches;
      });

    this.commentForm = this._fb.group({
      text: ['', Validators.required],
      poster: ['', Validators.required],
      name: ['', '']
    });

    this.commentForm.get('name').disable();

    this.commentForm.get('poster').valueChanges
      .subscribe((data: string) => { this.onPosterOptionChange(data); });

    this.filteredPosters = this.commentForm.get('text').valueChanges.pipe(
      startWith(''),
      map(value => {
        const beforeCursor = value.substr(0, this.cursorPosition + 1);
        return this.filter(beforeCursor.substr(beforeCursor.lastIndexOf("@")));
      })
    );

    this.isPostLikeActive = JSON.parse(localStorage.getItem(`p${this.postId}`));
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
        let currentPost = post.data
        if (currentPost.approved) {
          this.post = currentPost;
          this.prevId = post.prev_id;
          this.nextId = post.next_id;
        } else {
          this._router.navigate(['/home/404']);
        }
        this.comments = comments.results;
        this.hasNextPage = comments.next !== null ? true : false;
        this.posters = this.getPosters();
      },
      (err) => {
        console.log(err);
        this._router.navigate(['/home/404']);
      })
  }

  nextPreviousReset(directives: FormGroupDirective, id: number) {
    this.resetCommentForm(directives);
    this.nextPage = 2;
    this.hasNextPage = false;
    this.isPostLikeActive = JSON.parse(localStorage.getItem(`p${id}`));
    this.filteredPosters = this.commentForm.get('text').valueChanges.pipe(
      startWith(''),
      map(value => value.includes('@') ? this.filter(value) : [])
    );
  }

  goPrevious(directives: FormGroupDirective) {
    this.nextPreviousReset(directives, this.prevId);
    this._router.navigate(['./'],
      {
        relativeTo: this._route,
        queryParams: { id: this.prevId }
      });
  }

  goNext(directives: FormGroupDirective) {
    this.nextPreviousReset(directives, this.nextId);
    this._router.navigate(['./'],
      {
        relativeTo: this._route,
        queryParams: { id: this.nextId }
      });
  }

  updateLocalStorage(key: string, value: string) {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
  }

  updatePostLikes() {
    if (this.isPostLikeActive) {
      this._postService.updateLikes(this.post.id, this.post.likes - 1).subscribe();
      this.post.likes--;
      this.updateLocalStorage(`p${this.postId}`, JSON.stringify(!this.isPostLikeActive));
      this.isPostLikeActive = JSON.parse(localStorage.getItem(`p${this.postId}`));
    } else {
      this._postService.updateLikes(this.post.id, this.post.likes + 1).subscribe();
      this.post.likes++;
      this.updateLocalStorage(`p${this.postId}`, JSON.stringify(!this.isPostLikeActive));
      this.isPostLikeActive = JSON.parse(localStorage.getItem(`p${this.postId}`));
    }
  }

  updateCommentLikes(comment: Comment) {
    let isCommentLikeActive = JSON.parse(localStorage.getItem(`c${comment.id}p${this.postId}`));
    if (isCommentLikeActive) {
      this._commentService.updateLikes(comment.id, comment.likes - 1).subscribe();
      comment.likes--;
      this.updateLocalStorage(`c${comment.id}p${this.postId}`, 'false');
    } else {
      this._commentService.updateLikes(comment.id, comment.likes + 1).subscribe();
      comment.likes++;
      this.updateLocalStorage(`c${comment.id}p${this.postId}`, 'true');
    }
  }

  createNewComment(text: string, poster: string, directives: FormGroupDirective) {
    const newComment = {
      post: this.post.id,
      text: text,
      poster: poster ? poster : 'Anonymous'
    }
    this._commentService.createComment(newComment)
      .subscribe(() => {
        this._dialog.open(SubmitCommentComponent);
        this.resetCommentForm(directives);
      });
  }

  resetCommentForm(directives: FormGroupDirective) {
    directives.resetForm();
    this.commentForm.reset();
    this.commentForm.get('name').disable();
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

  getPosters(): string[] {
    let res = [];
    for (let i = 0; i < this.comments.length; i++) {
      res.push(('@' + this.comments[i].poster));
    }
    return res;
  }

  getUser(e) {
    const beforeCursor = this.valueBeforeChange.substr(0, this.cursorPosition);
    const noAlias = beforeCursor.substr(0, beforeCursor.lastIndexOf('@'));
    const afterCursor = this.valueBeforeChange.substr(this.cursorPosition);
    this.commentForm.get('text').setValue(noAlias + e + afterCursor);
  }

  setValue(e) {
    this.valueBeforeChange = e.value;
    this.cursorPosition = e.selectionStart;
  }

  filter(value: string): string[] {
    return this.posters.filter(
      poster => poster.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  loadMoreComments() {
    if (this.hasNextPage) {
      this._commentService.getCommentsByPost(this.postId, this.nextPage)
        .subscribe(comments => {
          for (let comment of comments.results) {
            this.comments.push(comment);
          }
          this.hasNextPage = comments.next !== null ? true : false;
          this.nextPage++;
          this.posters = this.getPosters();
        });
    }
  }

  isCommentLikeActive(id: number) {
    return JSON.parse(localStorage.getItem(`c${id}p${this.postId}`)) ? true : false;
  }
}