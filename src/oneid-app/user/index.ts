import UserLogin from './UserLogin';
import UserPassword from './UserPassword';
import UserSignUp from './UserSignUp';
import UserActivate from './UserActivate';
import RegisterSuccess from './RegisterSuccess';
import UserBindThirdParty from './UserBindThirdParty';

export const routes = [
  {path: '/oneid/login', name: 'oneid.login', component: UserLogin},
  {path: '/oneid/password', name: 'oneid.password', component: UserPassword},
  {path: '/oneid/signup', name: 'oneid.signup', component: UserSignUp},
  {path: '/oneid/activate', name: 'oneid.activate', component: UserActivate},
  {path: '/oneid/registersuccess', name: 'oneid.registersuccess', component: RegisterSuccess},
  {path: '/oneid/bindthirdparty', name: 'oneid.bindThirdParty', component: UserBindThirdParty},
];
