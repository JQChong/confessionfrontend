import { Component, OnInit } from '@angular/core';
import { PostService } from '../model-service/post/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  /**
   * Intended method: each post will be presented as material design cards. Details to be included are
   * post id, post content (i.e. text), time, likes and number of comments. Comments are not loaded in
   * this page. To minimize clutter, pagination should also be included. Will confirm with regards to
   * purging old confessions.
   * 
   * When a card is clicked, the user is redirected to the page with the post and the comments. This can be
   * done using the navigate method in Router class. During navigation, post id should also be passed as query
   * parameters so that relevant comments can be loaded at the page.
   * 
   * addendum: users should also be able to filter the posts by category. for this, users will be clicking
   * on the categories on the side panel. then user will be redirected, together with the category as one of
   * the query parameters.
  */

  public cards = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.populateCards();
  }

  populateCards() {
    this.cards = [];
    this.postService.getPostByStatus('True', 1).subscribe(
      data => {
        const posts = data.json().message;
        console.log(posts); // TODO comment out for production
        for (let post of posts) {
          this.cards.push({
            id: post.id,
            preview: this.getPreview(post.text),
            likes: post.likes,
            time_created: post.time_created
          });
        }
      },
      error => {
        console.log("error in populating cards with posts");
      }
    );
  }

  getPreview(text: string): string {
    return text.slice(0, 100) + "...";
  }

}
