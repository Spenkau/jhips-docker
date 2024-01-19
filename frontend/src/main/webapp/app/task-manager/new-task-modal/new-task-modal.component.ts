import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import ITask from "../interfaces/interfaces";

@Component({
  selector: 'jhi-new-task-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.scss'
})
export class NewTaskModalComponent {

  newTaskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category_id: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    priority_id: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    parent_id: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
  });

}
