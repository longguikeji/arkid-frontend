<template>
  <div
    v-if="state"
    :class="page"
  >
    <Tabs
      v-if="state.$tabs"
      path="admin.adminState.$tabs"
      class="admin-tabs-page"
    />
    <AdminComponent
      v-for="(name, index) in names"
      v-else
      :key="index"
      :path="`admin.adminState[${name}]`"
      class="admin-page"
    />
  </div>
  <div v-else-if="url">
    <iframe :src="url" />
  </div>
  <div
    v-else
    class="placeholder"
  >
    页面功能正在开发中...
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import { AdminModule } from '@/store/modules/admin'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'Admin',
  components: {}
})
export default class extends Vue {
  private get state() {
    return AdminModule.adminState
  }

  private get page(): string | string[] {
    return this.$route.meta.page
  }

  private get url(): string | undefined {
    return this.$route.meta.url
  }

  private get names(): string[] {
    return typeof this.page === 'string' ? [this.page] : this.page
  }

  async created() {
    if (this.page) {
      await runFlowByFile('flows/initPage', { page: this.page }).then(state => {
        if (state && Object.keys(state).length > 0) {
          AdminModule.setAdminState(state)
        }
      })
    }
  }

  destroyed() {
    AdminModule.setAdminState(null)
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/page.scss";

.placeholder {
  text-align: center;
  padding-top: 50px;
}

iframe {
  width: 100%;
  height: calc(100vh - 86px);
}

.admin-page,
.admin-tabs-page {
  margin: 20px;
}
</style>
