import {Vue, Component, Prop} from 'vue-property-decorator';
import {sideMenu} from './menu';
import WsPassword from '@/ws/setting/Password';

@Component
export default class Password extends WsPassword {
  get viewMeta() {
    return {
      breadcrumb: [
        {label: '设置', path: {name: 'oneid.config'}},
        '设置登录密码',
      ],
      sideMenu: {
        menus: sideMenu.menus,
        activeName: 'oneid.config.password',
      },
    };
  }
}
