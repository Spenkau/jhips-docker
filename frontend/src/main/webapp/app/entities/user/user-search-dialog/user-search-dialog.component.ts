import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AlertErrorComponent} from "../../../shared/alert/alert-error.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbActiveModal, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import TranslateDirective from "../../../shared/language/translate.directive";
import {IUser} from "../user.model";
import {UserService} from "../service/user.service";
import {ASC, DESC} from "../../../config/navigation.constants";
import {combineLatest, Observable, switchMap, tap} from "rxjs";
import {EntityArrayResponseType} from "../../task/service/task.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";
import {TOTAL_COUNT_RESPONSE_HEADER} from "../../../config/pagination.constants";

@Component({
  selector: 'jhi-user-search-dialog',
  standalone: true,
  imports: [
    AlertErrorComponent,
    FaIconComponent,
    NgbInputDatepicker,
    ReactiveFormsModule,
    TranslateDirective,
    FormsModule,
    RouterLink
  ],
  templateUrl: './user-search-dialog.component.html',
  styleUrl: './user-search-dialog.component.scss'
})
export class UserSearchDialogComponent implements AfterViewInit {
  @ViewChild('searchInput', {static: false})
  input!: ElementRef;

  users?: IUser[];

  predicate = 'id';
  ascending = true;
  totalItems?: number;
  isLoading = false;


  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private activeModal: NgbActiveModal
  ) {
  }

  navigateToUser(login?: string): void {
    this.route.navigate(['/users/' + login]);
    this.activeModal.dismiss();
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected fillComponentAttributesFromResponseBody(data: IUser[] | null): IUser[] {
    return data ?? [];
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.users = dataFromBody;
  }


  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected queryBackend(
    predicate?: string,
    ascending?: boolean,
  ): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
      'login.contains': this.input.nativeElement.value
    };
    return this.userService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
