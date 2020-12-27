import { Component, OnInit } from '@angular/core';
import { PostService } from '../model-service/post/post.service';
import { CommentService } from '../model-service/comment/comment.service';
import { Comment } from '../model-service/comment/comment'
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { zip } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
   * addendum: error handling, e.g. what happens if the id > number of posts (well since we put it as
   * a query param, ppl will mess around with it right?). i will subsequently make a simple error 404
   * page, so u may want to take adv of that? also, u can pass in two functions in subscribe(), one
   * is for normal operations, the other is for ______________ (find this out yourself lol).
   */

  post: any; // izit any?
  approvedPosts: any;
  numberOfApprovedPosts: number;
  comments: Comment[]; // izit any?
  commentForm: FormGroup;
  // isAnonymous: Boolean;
  // isReveal: Boolean;

  constructor(
    private _postService: PostService,
    private _commentService: CommentService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.reloadData();

    this.commentForm = this._fb.group({
      text: ['', Validators.required],
      poster: ['', Validators.required],
      name: ['', '']
      });

    this.commentForm.get('poster').valueChanges
      .subscribe((data: string) => { this.onPosterOptionChange(data); });

    this.approvedPosts = this._postService.getPostByStatus();
    this.numberOfApprovedPosts = this.approvedPosts.length;

    // Sample data
    this.post = { id!: 1,
                  text!: `You don't see things like Guys in Nursing, Male in Maid, Female in Army, yet we keep seeing Female in Tech marketing gimmicks and programs exclusively for females. Everyone will lose their mind if they see a Male in Tech Hackathon and outright call it sexist, yet Female in Tech Hackathon is socially acceptable. Everytime I see another Female in Tech program, I just scoffed.`,
                  likes!: 1,
                  time_created!: new Date(),
                  approved!: true };
    this.comments = [
      { id!: 1,
        post!: this.post,
        text!: `Society is readjusting. Now days people want more equal distribution of demographics be it gender, race, religion, etc. That's why got these kind of ads. I don't see why anyone should feel triggered. Some of the ads, not even targeted towards you. And for those that are for "general audience" but the picture is a lady, I also don't see why there is a reason to complain. No need to see the lady for what she is (i.e. a woman), but rather who she is (i.e a person).`,
        likes!: 1,
        time_created!: new Date(),
        poster!: 'Alex Onigawa',
        approved!: true },
      { id!: 2,
        post!: this.post,
        text!: `Actually computer engineering was originally considered a feminine profession in the 1950s - 1970s. This is until computing becomes commercialised and start to make money.....`,
        likes!: 2,
        time_created!: new Date(),
        poster!: 'Harper Zheng',
        approved!: true },
      { id!: 3,
        post!: this.post,
        text!: `People who are qualified for the job should get the job, and not because of any other lame ass reason`,
        likes!: 3,
        time_created!: new Date(),
        poster!: 'Daniel Ng',
        approved!: true },
      ];
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
        const post$ = this._postService.getPostById(postId)
        const comments$ = this._commentService.getCommentsByPost(postId)

        // combine and extract the data
        return zip(post$, comments$).pipe(map(([post, comments]) => ({ post, comments })));
      })
    ).subscribe(({ post, comments }) => {
      this.post = post;
      this.comments = comments.results;
    },
    (err) => {
      // fill in this part...
      this._router.navigate(['/pageNotFound']); // ?
      console.log(err);
    })
  }
  
  // Not working
  // checkAnonymous() {
  //   const name = this.commentForm.get('name');
  //   this.isAnonymous = true;
  //   this.isReveal = false;
  //   name.clearValidators();
  //   name.setValue('');
  //   name.disable();
  //   name.updateValueAndValidity();
  // }

  // checkReveal() {
  //   const name = this.commentForm.get('name');
  //   this.isReveal = true;
  //   this.isAnonymous = false;
  //   name.setValidators(Validators.required);
  //   name.enable();
  //   name.updateValueAndValidity();
  // }

  // checkRevealAlt() {
  //   const name = this.commentForm.get('name');
  //   this.isReveal = true;
  //   this.isAnonymous = false;
  //   name.setValidators(Validators.required);
  //   name.enable();
  //   name.updateValueAndValidity();
  // }

  goPrevious() {
    let previousId = (this.post.id - 1) <= 0 ? this.numberOfApprovedPosts : this.post.id - 1;
    // this._router.navigate(['home/post'], { queryParams: { id: previousId } });
    this._router.navigate(['./'], 
                          { relativeTo: this._route, 
                            queryParams: { id: previousId }}); // relative navigation
  }

  goNext() {
    let nextId = (this.post.id + 1) >= this.numberOfApprovedPosts ? 1 : this.post.id + 1;
    // this._router.navigate(['home/post'], { queryParams: { id: nextId } });
    this._router.navigate(['./'], 
                          { relativeTo: this._route, 
                            queryParams: { id: nextId }}); // relative navigation
  }

  updatePostLikes() {
    this._postService.updateLikes(this.post.id, this.post.likes + 1)
      .subscribe(() => { this.reloadData; });
  }

  updateCommentLikes(comment: Comment) {
    this._commentService.updateLikes(comment.id, comment.likes + 1)
      .subscribe(() => { this.reloadData; });
  }

  createNewComment(text: string, poster: string) {
    const newComment = {
      id: this.comments.length + 1,
      post: this.post.id,
      text: text,
      likes: 0,
      time_created: new Date(),
      poster: poster ? poster : 'Anonymous',
      approved: false
    }
    this._commentService.createComment(newComment)
      .subscribe(() => { this.reloadData; }); // subscribe need para?
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
}