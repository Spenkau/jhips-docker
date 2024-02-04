import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {IUser} from "../user.model";
import {UserService} from "../service/user.service";
import {HttpResponse} from "@angular/common/http";

export const userResolve = (route: ActivatedRouteSnapshot): Observable<null | IUser> => {
  const login = route.params['login'];
  if (login) {
    return inject(UserService)
      .find(login)
      .pipe(
        mergeMap((user: HttpResponse<IUser>) => {
          if (user.body) {
            return of(user.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userResolve;
