import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap, switchMap} from 'rxjs/operators';
import {CommentService} from "../service/comment.service";
import {UserService} from "../../user/service/user.service";
import {IComment} from "../comment.model";

@Injectable({
  providedIn: 'root',
})
export class CommentEditResolver implements Resolve<IComment | null> {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IComment | null> {
    const id = route.params['id'];
    if (id) {
      return this.commentService.find(id).pipe(
        mergeMap((comment) =>
          this.userService.owner.pipe(
            switchMap((owner: IComment) => {
              if (comment.body && comment.body.owner?.id === owner.id) {
                return of(comment.body);
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
