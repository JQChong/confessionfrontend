import { ChangeDetectionStrategy } from "@angular/core";

export class Category {
    public static readonly CATEGORIES = [
        new Category("Advice"),
        new Category("Ask Seniors"),
        new Category("Funny"),
        new Category("Rant"),
        new Category("Romance")
    ]

    name: string;

    constructor(name: string) {
        this.name = name;
    }
}