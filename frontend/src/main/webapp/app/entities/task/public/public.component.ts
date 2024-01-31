import {Component, OnInit} from '@angular/core';
import {PriorityEnum, StatusEnum} from "../task.enums";
import FormatMediumDatePipe from "../../../shared/date/format-medium-date.pipe";
import {JsonPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ITask} from "../task.model";
import {UserService} from "../../user/user.service";
import {TaskService} from "../service/task.service";

@Component({
  selector: 'jhi-public',
  standalone: true,
  imports: [
    FormatMediumDatePipe,
    JsonPipe,
    RouterLink
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent implements OnInit {

  tasks?: ITask[];
  userName: string | undefined = '';
  protected readonly StatusEnum = StatusEnum;
  protected readonly PriorityEnum = PriorityEnum;

  constructor(private userService: UserService, private taskService: TaskService) {
  }

  trackId = (_index: number, item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    this.userService.owner.subscribe(user => {
      this.userName = user?.login
    });
  }
}
