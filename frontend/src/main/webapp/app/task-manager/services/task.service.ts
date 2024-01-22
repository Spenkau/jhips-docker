import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/task');

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
  ) {}

  tasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.resourceUrl);
  }

  tasksByTag(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.resourceUrl);
  }

  tasksByCategory(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.resourceUrl);
  }


  // nestedTasks(): Observable<ITask[]> {
  //   return this.http.get<ITask[]>(this.resourceUrl);
  // }

  create(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.resourceUrl, task);
  }

  update(task: ITask): Observable<ITask> {
    return this.http.put<ITask>(this.resourceUrl, task);
  }

  find(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<ITask[]>> {
    const options = createRequestOption(req);
    return this.http.get<ITask[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }
}
import { Pagination } from 'app/core/request/request.model';

import {ICategory, ITask} from '../task-manager.model';
