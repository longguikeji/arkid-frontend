<template>
  <div
    v-if="isCompleted"
    style="height: 100%"
    :class="page"
  >
    <template v-if="isMultiPage">
      <AdminComponent
        v-for="(i, index) in page"
        :key="index"
        :path="`admin.adminState.${i}`"
      />
    </template>
    <template v-else>
      <AdminComponent :path="`admin.adminState.${page}`" />
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
import BaseVue from '@/admin/base/BaseVue'
import { isArray } from '@/utils/common'

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

  private get isCompleted(): boolean {
    return Object.keys(this.state || {}).length > 0
  }

  async created() {
    await runFlowByFile('flows/initPage', { page: this.page, state: {} }).then(async(result) => {
      await AdminModule.setAdmin(result)
    })
  }

  async destroyed() {
    await AdminModule.setAdmin(null)
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/group.scss';

.placeholder {
  text-align: center;
  padding-top: 50px;
}

iframe {
  width: 100%;
  height: calc(100vh - 84px);
}

</style>
