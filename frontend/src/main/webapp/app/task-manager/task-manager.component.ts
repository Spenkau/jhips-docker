import {Component, signal} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhi-task-manager',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export default class TaskManagerComponent {
  isUserSettingsCollapsed = false;

  showNewTaskModal(): void {

  }

}
