import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ApplicationConfigService} from 'app/core/config/application-config.service';
import {createRequestOption} from 'app/core/request/request-util';
import {isPresent} from 'app/core/util/operators';
import {Pagination} from 'app/core/request/request.model';
import {getUserIdentifier, IPrivateUser, IUser} from '../user.model';
import {map} from "rxjs/operators";
import {AccountService} from "../../../core/auth/account.service";

export type PartialUpdateCategory = Partial<IUser> & Pick<IUser, 'id'>;

export type EntityResponseType = HttpResponse<IUser>;
export type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({providedIn: 'root'})
export class UserService {
  owner: Observable<IUser>;
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/users');

  // private user?: IPrivateUser | IUser | null = null;

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
  ) {
    this.owner = this.accountService.getAuthenticationState().pipe(
      map((account: any): IUser => ({
        id: account.id,
        login: account.login
      }))
    );
  }

  find(login: string) {
    return this.http.get<IUser | IPrivateUser>(`${this.resourceUrl}/${login}`, {observe: 'response'})
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, {params: options, observe: 'response'});
  }

  compareUser(o1: Pick<IUser, 'id'> | null, o2: Pick<IUser, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  addUserToCollectionIfMissing<Type extends Partial<IUser> & Pick<IUser, 'id'>>(
    userCollection: Type[],
    ...usersToCheck: (Type | null | undefined)[]
  ): IUser[] {
    const users: Type[] = usersToCheck.filter(isPresent);
    if (users.length > 0) {
      const userCollectionIdentifiers = userCollection.map(userItem => getUserIdentifier(userItem)!);
      const usersToAdd = users.filter(userItem => {
        const userIdentifier = getUserIdentifier(userItem);
        if (userCollectionIdentifiers.includes(userIdentifier)) {
          return false;
        }
        userCollectionIdentifiers.push(userIdentifier);
        return true;
      });
      return [...usersToAdd, ...userCollection];
    }
    return userCollection;
  }
}
