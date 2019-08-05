import './main.less';

import App from './App';
import {getRoutes} from './routes';
import {boot, installComps} from '../boot';
import {getUser} from '../services/oneid';
import {Config} from '../services/config';

// import 'vue';
import iView from '../iview';
import Directives from '../directives';
import XMenu from '../xcomps/XMenu';
import XIcon from '../xcomps/XIcon';

import UserAva from './comps/UserAva';
import UserInfoList from './comps/UserInfoList';
import SimpleFrame from './comps/SimpleFrame';
import SiteLogo from './comps/SiteLogo';
import Layout from './comps/Layout';

import VueClipboard from 'vue-clipboard2';


(async function bootUp() {

  let getMetaFail = false;
  let getUserFail = false;
  try {
    await Promise.all([
      Config.refreshMeta().catch(ex => {
        getMetaFail = ex;
      }),
      getUser().catch(ex => {
        getUserFail = ex;
      }),
    ]);
  } catch (e) {}

  if (getMetaFail) {
    console.error('boot fail', {getMetaFail, getUserFail});
    return;
  } else if (getUserFail) {
    console.log('boot getUserFail', {getUserFail});
  }

  boot({
    App,
    routes: getRoutes(),
    plugins: [
      iView,
      VueClipboard,
      Directives,
      {
        install(Vue: any) {
          installComps({
            XMenu,
            XIcon,
            SimpleFrame,
            SiteLogo,
            Layout,
            UserAva,
            UserInfoList,
          }, Vue);
        },      // comps,
      },
    ],
  });
})();
