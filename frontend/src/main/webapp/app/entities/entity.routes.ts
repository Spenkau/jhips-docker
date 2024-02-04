import {Routes} from '@angular/router';
import {UserComponent} from "./user/user.component";
import {ASC} from "../config/navigation.constants";

const routes: Routes = [
  {
    path: 'task',
    data: { pageTitle: 'jhipsTestApp.task.home.title' },
    loadChildren: () => import('./task/task.routes'),
  },
  {
    path: 'category',
    data: { pageTitle: 'jhipsTestApp.category.home.title' },
    loadChildren: () => import('./category/category.routes'),
  },
  {
    path: 'tag',
    data: { pageTitle: 'jhipsTestApp.tag.home.title' },
    loadChildren: () => import('./tag/tag.routes'),
  },
  {
    path: 'comment',
    data: { pageTitle: 'jhipsTestApp.comment.home.title' },
    loadChildren: () => import('./comment/comment.routes'),
  },
  {
    path: 'users/:login',
    data: {
      isChildren: true,
      pageTitle: 'User tasks',
      defaultSort: 'id,' + ASC,
    },
    component: UserComponent,
  }
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
