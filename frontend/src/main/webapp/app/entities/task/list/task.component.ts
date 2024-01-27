import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data, ParamMap, Router, RouterModule} from '@angular/router';
import {combineLatest, filter, Observable, switchMap, tap} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import {SortByDirective, SortDirective} from 'app/shared/sort';
import {DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe} from 'app/shared/date';
import {FormsModule} from '@angular/forms';
import {ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT} from 'app/config/navigation.constants';
import {SortService} from 'app/shared/sort/sort.service';
import {ITask} from '../task.model';
import {EntityArrayResponseType, TaskService} from '../service/task.service';
import {TaskDeleteDialogComponent} from '../delete/task-delete-dialog.component';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ClockComponent} from "../../../task-manager/components/clock/clock.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  NewTaskModalComponent
} from "../../../task-manager/components/modal-window/new-task-modal/new-task-modal.component";
import {SidebarComponent} from "../../../task-manager/components/sidebar/sidebar.component";
import {TaskCardComponent} from "../../../task-manager/components/task-card/task-card.component";
import {
  TaskModalWrapperComponent
} from "../../../task-manager/components/modal-window/task-modal-wrapper/task-modal-wrapper.component";
import {AccountService} from "../../../core/auth/account.service";
import {PriorityEnum, StatusEnum} from "../task.enums";
import {TaskCreateDialogComponent} from "../create/task-create-dialog.component";
import {CategoryService} from "../../category/service/category.service";
import {TaskPostponeDialogComponent} from "../postpone/task-postpone-dialog.component";
import {IUser} from "../../user/user.model";
import {ICategory} from "../../category/category.model";
import {ITag} from "../../tag/tag.model";
import {UserService} from "../../user/user.service";
import {TagService} from "../../tag/service/tag.service";

@Component({
  standalone: true,
  selector: 'jhi-task',
  templateUrl: './task.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    FormatMediumDatePipe,
    AsyncPipe,
    ClockComponent,
    FaIconComponent,
    NewTaskModalComponent,
    NgForOf,
    NgIf,
    SidebarComponent,
    TaskCardComponent,
    TaskModalWrapperComponent,
  ],
})
export class TaskComponent implements OnInit {
  protected readonly PriorityEnum = PriorityEnum;
  @ViewChild('modalWrapper') modalWrapper!: TaskModalWrapperComponent
  subtask = false;

  tasks?: ITask[];

  usersSharedCollection: IUser[] = [];
  categoriesSharedCollection: ICategory[] = [];
  tagsSharedCollection: ITag[] = [];

  categories?: Observable<EntityArrayResponseType>;
  isLoading = false;
  isUserSettingsCollapsed = false;
  userName: string | undefined = '';
  showSidebar = false;

  predicate = 'id';
  ascending = true;

  protected readonly StatusEnum = StatusEnum;

  trackId = (_index: number, item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    this.load();

    this.accountService.identity().subscribe(account => {
      this.userName = account?.login
    });

    // TODO сделать подгрузку связей, чтобы отображалась в задаче категория

    this.loadRelationshipsOptions();
  }

  constructor(
    protected taskService: TaskService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private accountService: AccountService
  ) {
  }

  postpone(task: ITask): void {
    const modalRef = this.modalService.open(TaskPostponeDialogComponent, {size: 'lg'});
    modalRef.componentInstance.task = task;

    modalRef.closed.subscribe(() => {
      const updatedTask = modalRef.componentInstance.task;
      this.tasks = this.tasks?.map(task => task.id === updatedTask.id ? updatedTask : task)
    })
  }

  create(): void {
    const modalRef = this.modalService.open(TaskCreateDialogComponent, {size: 'xl'});

    modalRef.closed.subscribe(() => {
      const newTask = modalRef.componentInstance.task;

      this.tasks?.push(newTask)
      }
    )
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({

      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.tasks = this.refineData(dataFromBody);
  }

  protected refineData(data: ITask[]): ITask[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ITask[] | null): ITask[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.taskService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  closeSidebar(value: boolean): void {
    this.showSidebar = value;
  }

  delete(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialogComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.task = task;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  protected loadRelationshipsOptions(): void {
    //   this.userService
    //     .query()
    //     .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
    //     .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.task?.owner)))
    //     .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
    //
    //   this.categoryService
    //     .query()
    //     .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
    //     .pipe(
    //       map((categories: ICategory[]) => this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, this.task?.category)),
    //     )
    //     .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
    //
    //   this.tagService
    //     .query()
    //     .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
    //     .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.task?.tags ?? []))))
    //     .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
