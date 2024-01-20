import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";
import {ICategory} from "../../task-manager.model";
import {Observable} from "rxjs";


@Component({
  selector: 'jhi-new-task-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.scss'
})
export class NewTaskModalComponent {

  // categories: Observable<string[]> = ['fasdf','fsdaf'];

  newTaskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(256)] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(256)] }),
    category_id: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    priority_id: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    tag_ids: new FormControl(null),
    parent_id: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    console.log(this.newTaskForm.getRawValue())
  }

}