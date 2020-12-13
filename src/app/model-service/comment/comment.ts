import { Post } from '../post/post';

export class Comment {
    id!: number;
    post!: Post;
    text!: string; // to be loaded
    likes!: number; // to be loaded
    time_created!: Date; // to be loaded
    poster!: string; // to be loaded
    approved!: boolean
}