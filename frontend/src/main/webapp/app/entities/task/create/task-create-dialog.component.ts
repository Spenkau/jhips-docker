import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EntityResponseType, TaskService} from "../service/task.service";
import {ITask, NewTask} from "../task.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IUser} from "../../user/user.model";
import {ICategory} from "../../category/category.model";
import {ITag} from "../../tag/tag.model";
import {TaskFormGroup, TaskFormService} from "../service/task-form.service";
import {CategoryService} from "../../category/service/category.service";
import {TagService} from "../../tag/service/tag.service";
import {PriorityEnum, StatusEnum} from "../task.enums";
import SharedModule from "../../../shared/shared.module";
import {map} from "rxjs/operators";
import {HttpResponse} from "@angular/common/http";
import {AccountService} from "../../../core/auth/account.service";
import {UserService} from "../../user/service/user.service";

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
  task?: ITask | null = null;
  owner?: IUser;

  usersSharedCollection: IUser[] = [];
  categoriesSharedCollection: ICategory[] = [];
  tagsSharedCollection: ITag[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();
  protected readonly StatusEnum = StatusEnum;
  protected readonly PriorityEnum = PriorityEnum;

  constructor(
    private taskService: TaskService,
    private activeModal: NgbActiveModal,
    protected taskFormService: TaskFormService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected tagService: TagService,
    protected accountService: AccountService,
  ) {
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {
    this.loadRelationshipsOptions();

    this.userService.owner.subscribe(data => this.owner = data)
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm) as NewTask;
    task.statusId = 1;
    task.owner = this.owner;

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

  protected onSaveError(): void {
    console.log("Failed to create task")
  }

  confirmCreate(task: NewTask): void {
    console.log(task)
    this.taskService.create(task)
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

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.task?.owner)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) => this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, this.task?.category)),
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.task?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
