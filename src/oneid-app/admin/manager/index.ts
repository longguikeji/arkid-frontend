import Manager from './Manager';
import EditManager from './EditManager';

export const routes = [
  {path: '/admin/manager', name: 'admin.manager', component: Manager},
  {path: '/admin/manager/:id', name: 'admin.manager.edit', component: EditManager},
].map((c) => ({...c, meta: {title: '子管理员', matchNav: 'admin.manager'}}));
