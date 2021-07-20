<template>
  <el-dialog
    :visible.sync="isShow"
    :show-close="isShowClose"
    fullscreen
    @closed="goHome"
  >
    <table-page
      v-if="initCompleted"
      path="tenant.tenantState.state"
    />
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { TenantModule } from '@/store/modules/tenant'
import { runFlowByFile } from '@/arkfbp/index'
import { UserRole, UserModule } from '@/store/modules/user'

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

  private get currentPage() {
    return this.$route.meta.page
  }

  goHome() {
    this.$router.push('/')
  }

  async created() {
    this.isShow = true
    const tenantUUId = TenantModule.currentTenant.uuid
    if (tenantUUId) this.isShowClose = true
    const currentPage = this.currentPage
    await runFlowByFile('flows/initPage', {
      currentPage
    }).then(async(state) => {
      await runFlowByFile('flows/tenant/addButton', {
        state,
        com: this
      }).then(res => {
        TenantModule.changeState(res)
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
