import ConfigLayout from './ConfigLayout'

export const routes = [
  {path: '/admin/config', name: 'admin.config', component: ConfigLayout},
].map((c) => ({...c, meta: {title: '全部应用', matchNav: 'admin.config'}}))
