import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap, switchMap} from 'rxjs/operators';
import {CategoryService} from "../service/category.service";
import {UserService} from "../../user/service/user.service";
import {ICategory} from "../category.model";

@Injectable({
  providedIn: 'root',
})
export class CategoryEditResolver implements Resolve<ICategory | null> {
  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ICategory | null> {
    const id = route.params['id'];
    if (id) {
      return this.categoryService.find(id).pipe(
        mergeMap((category) =>
          this.userService.owner.pipe(
            switchMap((owner: ICategory) => {
              if (category.body && category.body.owner?.id === owner.id) {
                return of(category.body);
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
