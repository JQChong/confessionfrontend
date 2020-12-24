import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  /**
   * Intended method: Uh... it's a form, whaddaya expect???!! Though, if possible, include
   * captcha in the form
   */

  confessionForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  // TODO
  // consider changing return type if necessary
  submitConfession(value: any): void {

  }

}
