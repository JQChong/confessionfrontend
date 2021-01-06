// TODO how to get category?

import { Category } from "../category/category";

// TODO how to get number of comments?
export class Post {
    id!: number; // to be loaded
    text!: string; // to be loaded
    likes!: number; // to be loaded
    time_created!: Date; // to be loaded
    approved!: boolean;
    category!: Number[];
}