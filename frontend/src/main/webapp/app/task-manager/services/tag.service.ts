import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApplicationConfigService} from "../../core/config/application-config.service";
import {Observable} from "rxjs";
import { ITag } from "../task-manager.model";

@Injectable({ providedIn: 'root' })
export class TagService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/tags');

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
  ) {}

  tags(type: string): Observable<ITag[]> {
    return this.http.get<ITag[]>(this.resourceUrl + `/${type}`);
  }

  create(tag: ITag): Observable<ITag> {
    return this.http.post<ITag>(this.resourceUrl, tag);
  }

  update(tag: ITag): Observable<ITag> {
    return this.http.put<ITag>(this.resourceUrl, tag);
  }

  find(id: string): Observable<ITag> {
    return this.http.get<ITag>(`${this.resourceUrl}/${id}`);
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }
}
