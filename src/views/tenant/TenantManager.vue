<template>
  <el-dialog
    :visible.sync="isShow"
    :show-close="isShowClose"
    fullscreen
    @closed="goHome"
  >
    <table-page
      v-if="initCompleted"
      :path="`tenant.tenantState.${page}.state`"
    />
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { TenantModule } from '@/store/modules/tenant'
import { runFlowByFile } from '@/arkfbp/index'
import { UserRole, UserModule } from '@/store/modules/user'
import { ConfigModule } from '@/store/modules/config'

@Component({
  name: 'TenantManager'
})
export default class extends Vue {
  isShow = false
  initCompleted = false
  isShowClose = false

  private get state() {
    return TenantModule.tenantState
  }

  private get page() {
    return this.$route.meta.page
  }

  private get isVisibleDesktop() {
    return ConfigModule.desktop.visible
  }

  goHome() {
    if (this.isVisibleDesktop) {
      this.$router.push('/desktop')
    } else {
      this.$router.push('/mine/profile')
    }
  }

  async created() {
    this.isShow = true
    const tenantUUId = TenantModule.currentTenant.uuid
    if (tenantUUId) this.isShowClose = true
    await runFlowByFile('flows/initPage', {
      page: this.page,
      state: {}
    }).then(async(state) => {
      await runFlowByFile('flows/custom/tenant/addButton', {
        state,
        com: this,
        page: this.page
      }).then(_ => {
        TenantModule.changeState(state)
        this.initCompleted = true
      })
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 96% !important;
}
</style>
