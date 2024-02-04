import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap, switchMap} from 'rxjs/operators';
import {TaskService} from "../service/task.service";
import {UserService} from "../../user/service/user.service";
import {ITask} from "../task.model";
import {IUser} from "../../user/user.model";

@Injectable({
  providedIn: 'root',
})
export class TaskEditResolver implements Resolve<ITask | null> {
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ITask | null> {
    const id = route.params['id'];
    if (id) {
      return this.taskService.find(id).pipe(
        mergeMap((task) =>
          this.userService.owner.pipe(
            switchMap((owner: IUser) => {
              if (task.body && task.body.owner?.id === owner.id) {
                return of(task.body);
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
