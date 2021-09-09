<template>
  <div
    v-if="isStatePage"
    style="height: 100%"
    :class="page"
  >
    <div v-if="isMultiPage">
      <AdminComponent
        v-for="(i, index) in page"
        :key="index"
        :path="`admin.adminState.${i}`"
      />
    </div>
    <div v-else>
      <AdminComponent :path="`admin.adminState.${page}`" />
    </div>
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
import BaseVue from '@/admin/base/BaseVue'
import { isArray, isObject } from 'lodash'

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

  private get isMultiPage() {
    return isArray(this.page)
  }

  private get isStatePage(): boolean {
    return isObject(this.state)
  }

  async created() {
    if (this.page) {
      await runFlowByFile('flows/initPage', { page: this.page, state: {} }).then(async(result) => {
        if (Object.keys(result).length > 0) {
          await AdminModule.setAdmin(result)
        }
      })
    }
  }

  async destroyed() {
    await AdminModule.setAdmin(null)
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/group.scss';
@import '../../styles/desktop.scss';

.placeholder {
  text-align: center;
  padding-top: 50px;
}

iframe {
  width: 100%;
  height: calc(100vh - 90px);
}
</style>
