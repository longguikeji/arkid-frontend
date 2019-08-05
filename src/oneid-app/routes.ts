
import {routes as userRoutes} from './user';

import {routes as adminRoutes} from './admin';
import {routes as workspaceRoutes} from './workspace';


const oneidRoutes = [
  {
    path: '/',
    name: 'home',
    redirect: {
      name: 'workspace.apps',
    },
  },

  ...adminRoutes,
  ...workspaceRoutes,
  ...userRoutes,
];


export const getRoutes = () => [
  ...oneidRoutes,

  {
    path: '/*',
    redirect: {
      name: 'workspace.apps',
    },
  },
];
