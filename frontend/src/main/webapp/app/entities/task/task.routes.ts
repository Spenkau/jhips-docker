import {Routes} from '@angular/router';

import {UserRouteAccessService} from 'app/core/auth/user-route-access.service';
import {ASC} from 'app/config/navigation.constants';
import {TaskComponent} from './list/task.component';
import {TaskDetailComponent} from './detail/task-detail.component';
import {TaskUpdateComponent} from './update/task-update.component';
import TaskResolve from './route/task-routing-resolve.service';
import {PublicComponent} from "./public/public.component";

const taskRoute: Routes = [
  {
    path: '',
    component: TaskComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaskDetailComponent,
    resolve: {
      task: TaskResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TaskUpdateComponent,
    resolve: {
      task: TaskResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TaskUpdateComponent,
    resolve: {
      task: TaskResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'public',
    component: PublicComponent,
    canActivate: [UserRouteAccessService],
  }
];

export default taskRoute;
