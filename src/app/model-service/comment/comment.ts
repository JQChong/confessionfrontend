import { Post } from '../post/post';

export class Comment {
    post!: Post;
    text!: String;
    likes!: Number;
    time_created!: Date;
    poster!: String;
}