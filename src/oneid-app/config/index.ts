import Company from './Company';
import Launch from './Launch';
import Locale from './Locale';
import Admin from './Admin';
import SubAdmin from './subadmin/SubAdmin';
import EditSubAdmin from './subadmin/Edit';
import Password from './Password';
import ContactField from './ContactField';

export const routes = [
  {path: '/oneid/config', name: 'oneid.config', redirect: {name: 'oneid.config.company'}},
  {path: '/oneid/config/company', name: 'oneid.config.company', component: Company},
  {path: '/oneid/config/launch', name: 'oneid.config.launch', component: Launch},
  {path: '/oneid/config/locale', name: 'oneid.config.locale', component: Locale},
  {path: '/oneid/config/admin', name: 'oneid.config.admin', component: Admin},
  {path: '/oneid/config/subadmin', name: 'oneid.config.subadmin', component: SubAdmin},
  {path: '/oneid/config/subadmin/:id', name: 'oneid.config.subadmin.edit', params: {id: '0'}, component: EditSubAdmin},
  {path: '/oneid/config/password', name: 'oneid.config.password', component: Password},
  {path: '/oneid/config/contactfield', name: 'oneid.config.contactfield', component: ContactField},
].map(c => ({...c, meta: {title: '配置管理', matchNav: 'oneid.config'}}));
