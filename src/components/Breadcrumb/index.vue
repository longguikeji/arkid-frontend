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
        >{{ getTitle(item) }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { compile } from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'
import { DesktopModule } from '@/store/modules/desktop'

@Component({
  name: 'Breadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = []

  private get desktopVisitedApps() {
    return DesktopModule.desktopVisitedApps
  }

  @Watch('$route')
  private onRouteChange(route: Route) {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  @Watch('desktopVisitedApps')
  private onDesktopVisitedAppsChange() {
    this.getBreadcrumb()
  }

  created() {
    this.getBreadcrumb()
  }

  private getTitle(item: RouteRecord) {
    if (item.meta.app?.name) {
      return item.meta.app.name
    }
    return item.meta.title
  }

  private getBreadcrumb() {
    const desktopVisitedApps = this.desktopVisitedApps
    const currentApp = desktopVisitedApps[desktopVisitedApps.length - 1]
    if (this.$route.path === '/desktop') {
      this.$route.meta.app = currentApp
    }
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

  private pathCompile(path: string) {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    const { params } = this.$route
    const toPath = compile(path)
    return toPath(params)
  }

  private handleLink(item: any) {
    this.getBreadcrumb()
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect).catch(err => {
        // Throw Error "NavigationDuplicated"
        // https://github.com/vuejs/vue-router/issues/2872#issuecomment-522341874
        console.warn(err)
      })
      return
    }
    this.$router.push(this.pathCompile(path)).catch(err => {
      // Throw Error "NavigationDuplicated"
      // https://github.com/vuejs/vue-router/issues/2872#issuecomment-522341874
      console.warn(err)
    })
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
