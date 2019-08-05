import Config from './Config';

export const routes = [
  {path: '/admin/config', name: 'admin.config', component: Config},
].map((c) => ({...c, meta: {title: '全部应用', matchNav: 'admin.config'}}));
