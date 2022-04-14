<template>
  <div v-if="url">
    <iframe :src="url" />
  </div>
  <div
    v-else-if="state"
    :class="pages"
  >
    <Tabs
      v-if="state.$tabs"
      path="admin.adminState.$tabs"
      class="admin-tabs-page"
    />
    <template v-else>
      <AdminComponent
        v-for="(page, index) in pages"
        :key="index"
        :path="`admin.adminState[${page}]`"
        :class="`admin-page admin-${page}-page`"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AdminModule } from '@/store/modules/admin'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'Admin'
})
export default class extends Vue {
  private get state() {
    return AdminModule.adminState
  }

  private get pages(): undefined | string[] {
    const value = this.$route.meta?.page
    if (!value) return undefined
    if (typeof value === 'string') return [value]
    return value
  }

  private get url(): string | undefined {
    return this.$route.meta?.url
  }

  async created() {
    if (this.pages) {
      const state = Object.create({
        _pages_: [...this.pages],
        _cards_: this.pages,
        _tabs_: []
      })
      await runFlowByFile('flows/initPage', { state }).then(() => {
        AdminModule.setAdminState(state)
      })
    }
  }

  destroyed() {
    AdminModule.setAdminState(null)
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/page.scss';
@import '../../styles/element.scss';

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
  margin: 1rem;
}
</style>
