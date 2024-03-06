import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import {DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe} from 'app/shared/date';
import {ITask} from '../task.model';
import {IUser} from "../../user/user.model";
import {UserService} from "../../user/service/user.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  standalone: true,
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule],
})
export class TaskDetailComponent {
  @Input() task: ITask | null = null;
  owner$: Observable<IUser>;
  comments: { owner: IUser, content: string }[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.owner$ = this.userService.owner
  }

  addComment(contentInput: HTMLInputElement): void {
    const content = contentInput.value;
    this.owner$.subscribe(res => {
      this.comments.push({ owner: res, content })
    })

    contentInput.value = '';
  }

  previousState(): void {
    window.history.back();
  }
}
