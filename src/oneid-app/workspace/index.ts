import './workspace.less';

import Workspace from './Workspace';

import Userinfo from './userinfo/Userinfo';
import {ResetEmailCallback} from './userinfo/ResetEmail';
import Apps from './Apps';
import Contacts from './Contacts';


export const routes = [
  {
    path: '/workspace',
    component: Workspace,
    name: 'workspace',
    meta: {
      matchNav: 'workspace',
    },
    children: [
      {
        path: '/workspace/userinfo',
        component: Userinfo,
        name: 'workspace.userinfo',
        meta: {
          matchNav: 'workspace.userinfo',
        },
      },

      {
        path: '/workspace/apps',
        component: Apps,
        name: 'workspace.apps',
        meta: {
          matchNav: 'workspace.apps',
        },
      },

      {
        path: '/workspace/contacts',
        component: Contacts,
        name: 'workspace.contacts',
        meta: {
          matchNav: 'workspace.contacts',
        },
      },

    ],
  },
  {
    path: '/reset_email_callback',
    component: ResetEmailCallback,
    name: 'reset_email_callback',
    meta: {
      matchNav: 'reset_email_callback',
    },
  },
];
