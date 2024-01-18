import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-page',

    // @ts-expect-error('temporary solution')
    loadComponent: () => import('./user-page/user-page.component')
  }
];

export default routes;
