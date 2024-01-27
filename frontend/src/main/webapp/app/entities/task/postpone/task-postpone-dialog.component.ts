import {Component, OnInit} from '@angular/core';
import {EntityResponseType, TaskService} from "../service/task.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ITask} from "../task.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TaskFormGroup, TaskFormService} from "../service/task-form.service";
import SharedModule from "../../../shared/shared.module";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'jhi-task-postpone-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  templateUrl: './task-postpone-dialog.component.html',
  styleUrl: './task-postpone-dialog.component.scss'
})
export class TaskPostponeDialogComponent implements OnInit {
  task?: ITask;
  isSaving = false;
  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected activeModal: NgbActiveModal,
    protected activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    this.subscribeToSaveResponse(this.taskService.update(task as ITask));
  }

  cancel(): void {
    this.activeModal.close();
  }

  confirmPostpone(): void {
    const dates = this.editForm;
    const task = this.task;

    const newTask = {
      ...task,
      startedAt: dates.getRawValue().startedAt,
      finishedAt: dates.getRawValue().finishedAt
    }

    this.taskService.update(newTask as ITask)
      .subscribe((res: EntityResponseType): void => {
          if (res.body) {
            this.task = res.body;

            this.onSaveFinalize();
            this.onSaveSuccess();
          } else {
            this.onSaveError();
          }
        },
      );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.cancel();
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveError(): void {
    console.log("Failed to create task")
  }
}
