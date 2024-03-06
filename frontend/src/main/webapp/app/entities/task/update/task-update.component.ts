import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IUser} from 'app/entities/user/user.model';
import {ICategory} from 'app/entities/category/category.model';
import {CategoryService} from 'app/entities/category/service/category.service';
import {ITag} from 'app/entities/tag/tag.model';
import {TagService} from 'app/entities/tag/service/tag.service';
import {TaskService} from '../service/task.service';
import {ITask} from '../task.model';
import {TaskFormGroup, TaskFormService} from '../service/task-form.service';
import {UserService} from "../../user/service/user.service";

@Component({
  standalone: true,
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;
  owner?: IUser;

  categoriesSharedCollection: ICategory[] = [];
  tagsSharedCollection: ITag[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
  ) {}


  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        task = {
          ...this.task,
          content: task.content?.replace(/<br>/g, "\n")
        };
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });

    this.userService.owner.subscribe(owner => this.owner = owner)
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    let task = this.taskFormService.getTask(this.editForm);
    task = {
      ...task,
      owner: this.owner,
      content: task.content?.replace(/\n/g, "<br>")
    }
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      task.category,
    );
    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, ...(task.tags ?? []));
  }

  protected loadRelationshipsOptions(): void {
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
