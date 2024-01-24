import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { ITask } from '../task.model';
import { EntityArrayResponseType, TaskService } from '../service/task.service';
import { TaskDeleteDialogComponent } from '../delete/task-delete-dialog.component';
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
import {PriorityEnum} from "../task.enums";

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
  @ViewChild('modalWrapper') modalWrapper!: TaskModalWrapperComponent
  subtask = false;

  tasks?: ITask[];
  isLoading = false;
  isUserSettingsCollapsed = false;
  userName: string | undefined = '';
  showSidebar = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private accountService: AccountService
  ) {}

  trackId = (_index: number, item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    this.load();

    this.accountService.identity().subscribe(account => {
      this.userName = account?.login
    })
  }

  delete(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
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

  openModal(subtask: boolean): void {
    this.subtask = subtask;
    this.modalWrapper.openModal();
  }

  closeSidebar(value: boolean): void {
    this.showSidebar = value;
  }

  protected readonly PriorityEnum = PriorityEnum;
}
