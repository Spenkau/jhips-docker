import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {NewTaskModalComponent} from "./modal-window/new-task-modal/new-task-modal.component";
import {ClockComponent} from "./clock/clock.component";
import {TaskModalWrapperComponent} from "./modal-window/task-modal-wrapper/task-modal-wrapper.component";

@Component({
  selector: 'jhi-task-manager',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    RouterLink,
    NewTaskModalComponent,
    ClockComponent,
    TaskModalWrapperComponent
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export default class TaskManagerComponent {
  @ViewChild('modalWrapper') modalWrapper!: TaskModalWrapperComponent
  isUserSettingsCollapsed = false;

  openModal(subtask: boolean): void {
    this.modalWrapper.openModal(subtask);
  }

}
