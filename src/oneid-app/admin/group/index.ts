import Meta from './meta/Meta';
import Group from './group/Group';
import Perm from './perm/Perm';

export const routes = [
  {path: '/admin/group', name: 'admin.group', component: Meta, children: [
    {path: '/admin/group/perm', name: 'admin.group.perm', component: Perm},
    {path: '/admin/group/node', name: 'admin.group.node', component: Group},
  ]},
].map((c) => ({...c, meta: {title: '分组管理', matchNav: 'admin.group'}}));
