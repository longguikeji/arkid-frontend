import Application from './Application';
import AddApp from './AddApp';
import Perm from './Perm';

export const routes = [
  {path: '/admin/app', name: 'admin.app', component: Application},
  // {path: '/admin/app/add', name: 'admin.app.add', component: AddApp},
  {path: '/admin/app/:uid/perm', name: 'admin.app.perm', component: Perm},
].map((c) => ({...c, meta: {title: '全部应用', matchNav: 'admin.app'}}));
