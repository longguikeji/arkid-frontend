import {Vue, Component, Watch, Prop, Mixins} from 'vue-property-decorator';
import * as api from '../services/oneid';
import {injectLoginRequired} from '../services/base';
import {Route} from 'vue-router';


@Component({})
export default class LoginMixin extends Vue {
  user: {
    isLogin?: boolean,
    hasAccessToAdmin?: boolean,
  }|null = null;

  get isLogin(): boolean {
    return Boolean(this.user && this.user.isLogin);
  }
  get hasAccessToAdmin(): boolean {
    return Boolean(this.isLogin && this.user && this.user.hasAccessToAdmin);
  }

  @Watch('isLogin')
  onLoginChange(val: LoginMixin['isLogin']) {
    if (!val) {
      this.resolveNavigation();
    }
  }

  created() {
    injectLoginRequired(() => {
      this.user = null;
    });

    this.$router.beforeEach((to, from, next) => {
      // console.log('app $router beforeEach', to, from);

      const target = this.getLoginTarget(to);
      if (target) {
        next(target);

        return;
      }

      const adminTarget = this.getAdminTarget(to);
      if (adminTarget) {
        next(adminTarget);
        return;
      }

      const internTarget = this.getInternTarget(to);
      if (internTarget) {
        next(internTarget);
        return;
      }

      next();
    });

    this.loadCachedUser();
    this.resolveNavigation();
  }

  getLoginPath(): string | void {
  }

  resolveNavigation(): void {
    const target = this.getLoginTarget(this.$route);

    if (target) {
      let path = this.getLoginPath();
      if (typeof __ONEID_LOGIN_PATH__ !== 'undefined') {
        path = __ONEID_LOGIN_PATH__;
      }

      if (path) {
        location.href = path;
        return;
      }

      this.$router.push(target);
    } else {
      // 非admin账号，限制admin相关的路由
      const adminTarget = this.getAdminTarget(this.$route);
      if (adminTarget) {
        this.$router.push(adminTarget);
        return;
      }

      const internTarget = this.getInternTarget(this.$route);
      if (internTarget) {
        this.$router.push(internTarget);
        return;
      }
    }
  }

  getLoginTarget(to: Route) {
    // TODO: 还有其他几个page 也不需要登录
    if (!this.isLogin && this.isRouteRequireLogin(to)) {
      return {
        name: 'oneid.login',
        query: {
          backPath: to.fullPath,
        },
      };
    }
  }

  getAdminTarget(to: Route) {
    if (this.user && !this.user!.hasAccessToAdmin && this.isRouteRequireAdmin(to)) {
      return {
        name: 'workspace.apps',
      };
    }
  }

  getInternTarget(to: Route) {
    console.log(this.user);
    if (this.user && this.user.is_extern_user && this.isRouteRequireIntern(to)) {
      return {
        name: 'workspace.apps',
      };
    }
  }

  isRouteRequireLogin(route: Route): boolean {
    return !route.name || [
      'oneid.login',
      'oneid.signup',
      'oneid.activate',
      'oneid.password',
      'oneid.registersuccess',
    ].indexOf(route.name) === -1;
  }

  isRouteRequireIntern(route: Route): boolean {
    return !!route.name && route.name.startsWith('workspace.contacts');
  }

  isRouteRequireAdmin(route: Route): boolean {
    return !!route.name && route.name.startsWith('admin');
  }

  onLogin(user: {}): void {
    this.user = user;
  }

  async logout() {
    await api.UCenter.revokeToken();
    await api.logout();
    this.doLogout();
  }

  doLogout() {
    this.user = null;
  }

  loadCachedUser() {
    const cachedUser = api.getCachedUser();
    if (cachedUser) {
      this.onLogin({
        isLogin: true,
        ...cachedUser
      });
    }
  }

}
