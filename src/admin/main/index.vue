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
    <template v-else>
      <AdminComponent
        v-for="(card, index) in cards"
        :key="index"
        :path="`admin.adminState[${card}]`"
        :class="`admin-page admin-${card}-page`"
      />
    </template>
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
import { AdminModule } from '@/store/modules/admin'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'Admin'
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

  private get cards(): string[] {
    return typeof this.page === 'string' ? [this.page] : this.page
  }

  async created() {
    if (this.page) {
      const state = Object.create({ _pages_: [...this.cards], _cards_: this.cards, _tabs_: [] })
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
@import "../../styles/page.scss";
@import "../../styles/element.scss";

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
