<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path + index"
      >
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
          class="no-redirect"
        >{{ appName || item.meta.title }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'
import { DesktopModule, IDesktopSingleApp } from '@/store/modules/desktop'

@Component({
  name: 'Breadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = []
  private appName = ''

  private get desktopCurrentApp() {
    return DesktopModule.desktopCurrentApp
  }

  @Watch('$route')
  private onRouteChange(route: Route) {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  @Watch('desktopCurrentApp')
  private onDesktopCurrentAppChange(app: IDesktopSingleApp) {
    this.appName = app?.name || ''
  }

  created() {
    this.getBreadcrumb()
  }

  private getBreadcrumb() {
    let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
    const first = matched[0]
    if (!this.isDashboard(first)) {
      matched = [{ path: '/desktop', meta: { title: '主页' } } as RouteRecord].concat(matched)
    }
    this.breadcrumbs = matched.filter((item) => {
      return item.meta && item.meta.title && item.meta.breadcrumb !== false
    })
  }

  private isDashboard(route: RouteRecord) {
    const name = route && route.name
    if (!name) {
      return false
    }
    return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
  }

  private handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect)
      return
    }
    if (path === '/desktop') {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
