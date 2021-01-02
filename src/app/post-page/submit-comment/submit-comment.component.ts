import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-comment',
  template: `
    <h2 mat-dialog-title>Comment Submission Confirmation</h2>
    <mat-dialog-content>
      You have submitted a comment. Kindly wait patiently for your comment to be approved.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
  ]
})
export class SubmitCommentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
