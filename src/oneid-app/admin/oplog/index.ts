import Oplog from './Oplog';


export const routes = [
  {path: '/admin/oplog', name: 'admin.oplog', component: Oplog},
].map((c) => ({...c, meta: {title: '操作日志', matchNav: 'admin.oplog'}}));
