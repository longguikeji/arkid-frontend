<template>
  <el-dialog
    :visible.sync="isShow"
    :show-close="isShowClose"
    fullscreen
    @closed="goHome"
  >
    <dashboard-page
      v-if="initCompleted"
      class="tenant"
      :path="`tenant.tenantState[${page}].state`"
    />
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { TenantModule } from '@/store/modules/tenant'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'Tenant'
})
export default class extends Vue {
  isShow = false
  initCompleted = false
  isShowClose = false

  private get page() {
    return this.$route.meta?.page
  }

  goHome() {
    this.$router.push('/desktop')
  }

  async created() {
    this.isShow = true
    const tenantUUId = TenantModule.currentTenant.uuid
    if (tenantUUId) this.isShowClose = true
    if (this.page) {
      const state = Object.create({ _pages_: [this.page] })
      await runFlowByFile('flows/initPage', { state }).then(() => {
        TenantModule.changeState(state)
        this.initCompleted = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 93% !important;
  .el-image {
    width: 40px !important;
    height: 40px !important;
  }
  .tenant {
    height: 100%;
    .el-card {
      height: 100%;
      position: relative;
      overflow: auto;
    }
    .el-card__body {
      position: relative;
      height: auto;
      overflow: auto;
      .no-drag-board {
        min-height: calc(100% - 32px);
        overflow: auto;
        .item {
          display: inline-block;
        }
      }
    }
    .el-pagination {
      padding: 10px;
      border-top: 0px !important;
    }
  }
}
</style>
