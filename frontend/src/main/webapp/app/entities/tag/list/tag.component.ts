import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, ParamMap, Router, RouterModule} from '@angular/router';
import {combineLatest, filter, Observable, switchMap, tap} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import {SortByDirective, SortDirective} from 'app/shared/sort';
import {DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe} from 'app/shared/date';
import {FormsModule} from '@angular/forms';
import {ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT} from 'app/config/navigation.constants';
import {SortService} from 'app/shared/sort/sort.service';
import {ITag} from '../tag.model';
import {EntityArrayResponseType, TagService} from '../service/tag.service';
import {TagDeleteDialogComponent} from '../delete/tag-delete-dialog.component';
import {ITask} from "../../task/task.model";
import {TaskService} from "../../task/service/task.service";
import {PriorityEnum, StatusEnum} from "../../task/task.enums";
import {TaskComponent} from "../../task/list/task.component";
import {UserService} from "../../user/service/user.service";

@Component({
  standalone: true,
  selector: 'jhi-tag',
  templateUrl: './tag.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    TaskComponent,
  ],
})
export class TagComponent implements OnInit {
  data!: Data;
  tasks?: ITask[] | null
  tags?: ITag[];
  isEditEnabled = false;
  isLoading = false;
  isDeleteEnabled = false;
  activeTagId = 1;
  login?: string;
  predicate = 'id';
  ascending = true;

  protected readonly StatusEnum = StatusEnum;


  constructor(
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    protected taskService: TaskService,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    })
  }

  trackId = (_index: number, item: ITag): number => this.tagService.getTagIdentifier(item);

  ngOnInit(): void {
    this.load();

    this.showTasksByTag(this.activeTagId);

    this.route.data.subscribe((data: Data) => this.data = data);

  }

  delete(tag: ITag): void {
    const modalRef = this.modalService.open(TagDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tag = tag;
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
    this.tags = this.refineData(dataFromBody);
  }

  protected refineData(data: ITag[]): ITag[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ITag[] | null): ITag[] {
    return data ?? [];
  }

  tagFilter(val: string): void {
    this.tags = this.tags?.filter(item => item.name === val);
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
  protected readonly PriorityEnum = PriorityEnum;

  showTasksByTag(tagId: number): void {
    this.activeTagId = tagId;

    this.taskService.query({['tags.contains']: this.activeTagId}).subscribe(res => {
      this.tasks = res.body;
    })
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
      login: this.login
    };
    return this.tagService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }
}
