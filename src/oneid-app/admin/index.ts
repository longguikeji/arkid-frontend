// import {routes as authRoutes} from './auth';
import {routes as accountRoutes} from './account'
import Admin from './Admin'
import {routes as appRoutes} from './apps'
import {routes as configRoutes} from './config'
import ConfigPage from './ConfigPage.vue'
import {routes as groupRoutes} from './group'
import {routes as managerRoutes} from './manager'
import {routes as oplogRoutes} from './oplog'

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
]

export const mRoutes = [
  {
    path: '/admin',
    component: Admin,
    name: 'admin',
    meta: {
      matchNav: 'admin',
    },
    children: [
      ...groupRoutes,
      ...appRoutes,
      ...configRoutes,
      ...oplogRoutes,
      ...managerRoutes,
    ],
  },
]