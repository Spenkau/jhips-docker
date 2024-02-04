import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap, switchMap} from 'rxjs/operators';
import {TagService} from "../service/tag.service";
import {UserService} from "../../user/service/user.service";
import {ITag} from "../tag.model";

@Injectable({
  providedIn: 'root',
})
export class TagEditResolver implements Resolve<ITag | null> {
  constructor(
    private taskService: TagService,
    private userService: UserService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ITag | null> {
    const id = route.params['id'];
    if (id) {
      return this.taskService.find(id).pipe(
        mergeMap((tag) =>
          this.userService.owner.pipe(
            switchMap((owner: ITag) => {
              if (tag.body && tag.body.owner?.id === owner.id) {
                return of(tag.body);
              } else {
                this.router.navigate(['404']);
                return EMPTY;
              }
            })
          )
        )
      );
    }

    return of(null);
  }
}
