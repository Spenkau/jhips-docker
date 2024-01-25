import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TaskService} from "../service/task.service";
import {ITask, NewTask} from "../task.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IUser} from "../../user/user.model";
import {ICategory} from "../../category/category.model";
import {ITag} from "../../tag/tag.model";
import {TaskFormGroup, TaskFormService} from "../service/task-form.service";
import {UserService} from "../../user/user.service";
import {CategoryService} from "../../category/service/category.service";
import {TagService} from "../../tag/service/tag.service";
import {PriorityEnum, StatusEnum} from "../task.enums";
import {Observable, of} from "rxjs";
import SharedModule from "../../../shared/shared.module";

@Component({
  selector: 'jhi-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './task-create-dialog.component.html',
  styleUrl: './task-create-dialog.component.scss'
})
export class TaskCreateDialogComponent {
  isSaving = false;
  task!: Observable<ITask>;

  usersSharedCollection: IUser[] = [];
  categoriesSharedCollection: ICategory[] = [];
  tagsSharedCollection: ITag[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    private taskService: TaskService,
    private activeModal: NgbActiveModal,
    protected taskFormService: TaskFormService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected tagService: TagService,
  ) {
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);


  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm) as NewTask;
    task.statusId = 1;

    this.confirmCreate(task);
  }

  protected onSaveSuccess(): void {
    this.cancel();
  }

  cancel(): void {
    this.activeModal.close();
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  confirmCreate(task: NewTask): void {
    this.taskService.create(task)
      .subscribe((res) => {
          if (res.body) {
            this.task = of(res.body);

            this.onSaveFinalize();
            this.onSaveSuccess();
          } else {
            this.onSaveError();
          }
        },
      );
  }

  protected onSaveError(): void {
    console.log("Failed to create task")
  }

  protected readonly StatusEnum = StatusEnum;
  protected readonly PriorityEnum = PriorityEnum;
}
