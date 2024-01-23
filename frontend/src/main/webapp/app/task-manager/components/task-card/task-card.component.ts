import {Component, Input, Output} from '@angular/core';
import {ITask} from "../../task-manager.model";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'jhi-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: ITask;

  // @Output()

  constructor(
    private taskService: TaskService,
  ) {}

  deleteTask(id: string): void {
    this.taskService.delete(id)
  }
}
