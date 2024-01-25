import {Component} from '@angular/core';
import {TaskService} from "../service/task.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ITask} from "../task.model";
import {ITEM_DELETED_EVENT} from "../../../config/navigation.constants";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TaskFormGroup, TaskFormService} from "../service/task-form.service";
import SharedModule from "../../../shared/shared.module";

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
export class TaskPostponeDialogComponent {
  task?: ITask;
  isSaving = false;
  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected activeModal: NgbActiveModal,
  ) {
  }

  save(): void {

  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmPostpone(task: ITask): void {
    this.taskService.update(task).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
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
