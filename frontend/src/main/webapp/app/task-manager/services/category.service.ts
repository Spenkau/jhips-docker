import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ICategory} from "../task-manager.model";
import {HttpClient} from "@angular/common/http";
import {ApplicationConfigService} from "../../core/config/application-config.service";

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/category');

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
  ) {}

  categories(type: string): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.resourceUrl + `/${type}`);
  }

  create(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.resourceUrl, category);
  }

  update(category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(this.resourceUrl, category);
  }

  find(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.resourceUrl}/${id}`);
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }
}
