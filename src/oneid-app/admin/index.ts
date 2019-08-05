// import {routes as authRoutes} from './auth';
import Admin from './Admin';
import {routes as accountRoutes} from './account';
import {routes as groupRoutes} from './group';
import {routes as appRoutes} from './apps';
import {routes as configRoutes} from './config';
import {routes as oplogRoutes} from './oplog';
import {routes as managerRoutes} from './manager';
import ConfigPage from './ConfigPage.vue';

export const routes = [
  {
    path: '/admin',
    component: Admin,
    name: 'admin',
    meta: {
      matchNav: 'admin',
    },
    children: [
      ...accountRoutes,
      ...groupRoutes,
      ...appRoutes,
      ...configRoutes,
      ...oplogRoutes,
      ...managerRoutes,
    ],
  },
];
