<template>
  <div
    v-if="state && initCompleted"
    style="height: 100%"
    :class="currentPage"
  >
    <div
      v-if="isMultiPage"
      class="multi-page"
    >
      <template v-for="(page, index) in state">
        <AdminComponent
          :key="index"
          :path="'admin.adminState[' + index + ']'"
        />
      </template>
    </div>
    <div v-else>
      <AdminComponent :path="'admin.adminState'" />
    </div>
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
  private initCompleted = false

  private get state() {
    return AdminModule.adminState
  }

  private get isMultiPage() {
    return isArray(this.state)
  }

  private get currentPage() {
    return this.$route.meta.page
  }

  async created() {
    const currentPage = this.currentPage
    await runFlowByFile('flows/initPage', { currentPage }).then(async(result) => {
      await AdminModule.setAdmin(result)
      this.initCompleted = true
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
</style>
