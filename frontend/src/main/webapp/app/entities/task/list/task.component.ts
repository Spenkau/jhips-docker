import {Component, Input, OnInit} from '@angular/core';
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
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

import {PriorityEnum, StatusEnum} from "../task.enums";
import {TaskCreateDialogComponent} from "../create/task-create-dialog.component";
import {CategoryService} from "../../category/service/category.service";
import {TaskPostponeDialogComponent} from "../postpone/task-postpone-dialog.component";
import {ICategory} from "../../category/category.model";
import {ITag} from "../../tag/tag.model";
import {TagService} from "../../tag/service/tag.service";
import {HttpHeaders} from "@angular/common/http";
import FilterComponent from "../../../shared/filter/filter.component";
import ItemCountComponent from "../../../shared/pagination/item-count.component";
import {FilterOptions, IFilterOption, IFilterOptions} from "../../../shared/filter";
import {ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER} from "../../../config/pagination.constants";
import {SidebarComponent} from "../../../shared/sidebar/sidebar.component";
import {ClockComponent} from "../../../shared/clock/clock.component";
import {UserService} from "../../user/service/user.service";

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
    NgForOf,
    NgIf,
    SidebarComponent,
    FilterComponent,
    ItemCountComponent,
    SidebarComponent,
    ClockComponent,
  ],
})
export class TaskComponent implements OnInit {

  @Input() parentData!: Data;
  showFilters = false;

  tasks?: ITask[];

  categoriesSharedCollection: ICategory[] = [];
  tagsSharedCollection: ITag[] = [];

  categories?: Observable<EntityArrayResponseType>;
  isLoading = false;
  isUserSettingsCollapsed = false;
  userName: string | undefined = '';
  showSidebar = false;

  filters: IFilterOptions = new FilterOptions();

  predicate = 'id';
  ascending = true;
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  protected readonly PriorityEnum = PriorityEnum;
  protected readonly StatusEnum = StatusEnum;

  constructor(
    protected taskService: TaskService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) {
  }

  trackId = (_index: number, item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    this.load();

    this.userService.owner.subscribe(user => {
      this.userName = user.login
    });

    this.filters.filterChanges.subscribe(filterOptions => this.handleNavigation(1, this.predicate, this.ascending, filterOptions));


    // TODO сделать подгрузку связей, чтобы отображалась в задаче категория

    this.loadRelationshipsOptions();
    setTimeout(() => {
      console.log(this.tasks)
    }, 500)
  }



  postpone(task: ITask): void {
    const modalRef = this.modalService.open(TaskPostponeDialogComponent, {size: 'lg'});
    modalRef.componentInstance.task = task;

    modalRef.closed.subscribe(() => {
      const updatedTask = modalRef.componentInstance.task;
      this.tasks = this.tasks?.map((task) => task.id === updatedTask.id ? updatedTask : task)
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

  applyFilter(filterObj: { filterName: string, value: string }): void {
    this.filters.addFilter(filterObj.filterName, filterObj.value);
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending, this.filters.filterOptions);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending, this.filters.filterOptions);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending, this.filters.filterOptions)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);

    let sort;
    if (params.get(SORT) ?? data[DEFAULT_SORT_DATA]) {
      sort = params.get(SORT) ?? data[DEFAULT_SORT_DATA];
    } else {
      sort = this.parentData[DEFAULT_SORT_DATA]
    }
    sort = sort.split(',');

    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
    this.filters.initializeFromParams(params);
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.tasks = dataFromBody;
  }

  protected refineData(data: ITask[]): ITask[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ITask[] | null): ITask[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(
    page?: number,
    predicate?: string,
    ascending?: boolean,
    filterOptions?: IFilterOption[],
  ): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    filterOptions?.forEach(filterOption => {
      queryObject[filterOption.name] = filterOption.values;
    });
    return this.taskService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean, filterOptions?: IFilterOption[]): void {
    const queryParamsObj: any = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    filterOptions?.forEach(filterOption => {
      queryParamsObj[filterOption.nameAsQueryParam()] = filterOption.values;
    });

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
    //   this.categoryService
    //     .query()
    //     .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
    //     .pipe(
    //       map((categories: ICategory[]) => this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, task?.category)),
    //     )
    //     .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
    //
    //   this.tagService
    //     .query()
    //     .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
    //     .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(task?.tags ?? []))))
    //     .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
