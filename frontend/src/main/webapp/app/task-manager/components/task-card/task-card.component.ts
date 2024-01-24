import {Component, Input, Output} from '@angular/core';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import {TaskService} from "../../services/task.service";
import {ITask} from "../../../entities/task/task.model";

@Component({
  selector: 'jhi-task-card',
  standalone: true,
  imports: [
    FormatMediumDatePipe
  ],
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
