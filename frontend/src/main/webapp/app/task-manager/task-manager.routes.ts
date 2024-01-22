import { Routes } from '@angular/router';
import {UserPageComponent} from "./user-page/user-page.component";
import {TagPageComponent} from "./tag-page/tag-page.component";
import {TaskPageComponent} from "./task-page/task-page.component";

const routes: Routes = [
  {
    path: 'user-page',
    component: UserPageComponent,
    // loadComponent: () => import('./user-page/user-page.component'),
    title: 'user-page'
  },
  {
    path: 'tags',
    component: TagPageComponent,
    // loadComponent: () => import('./tag-page/tag-page.component')
  },
  {
    path: 'task/:id',
    component: TaskPageComponent
    // loadComponent: () => import('./task-page/task-page.component')
  }
];

export default routes;
