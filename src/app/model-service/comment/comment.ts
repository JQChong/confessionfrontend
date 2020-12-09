import { Post } from '../post/post';

export class Comment {
    id!: number;
    post!: Post;
    text!: string;
    likes!: number;
    time_created!: Date;
    poster!: string;
    approved!: boolean
}