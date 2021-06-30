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
import { Component, Prop, Watch } from 'vue-property-decorator'
import TablePage from '@/admin/TablePage/index.vue'
import { TenantModule } from '@/store/modules/tenant'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI, { ITagPage } from '@/config/openapi'
import getInitContent from '@/utils/get-init-content'
import { UserRole, UserModule } from '@/store/modules/user'

@Component({
  name: 'TenantManager',
  components: {
    TablePage
  }
})
export default class extends Vue {
  isShow = true
  initCompleted = false
  isShowClose = false

  private get state() {
    return TenantModule.tenantState
  }

  goHome() {
    this.$router.push('/')
  }

  async created() {
    this.isShow = true
    // 执行查看 TenantModule.currentTenant 当前的内容，如果不存在uuid，则设置isShowClose为false
    const tenantUUId = TenantModule.currentTenant.uuid
    if (tenantUUId) {
      this.isShowClose = true
    }
    const currentPage = this.$route.meta.page
    const initContent = getInitContent(currentPage) as ITagPage
    if (!initContent) {
      throw Error('This Page is not initContent Source, Please Check OpenAPI')
    }
    await runFlowByFile('flows/basePage', {
      initContent,
      currentPage
    }).then(async(data) => {
      await runFlowByFile('flows/tenant/addButton', {
        tempState: data.state,
        com: this
      }).then((data) => {
        TenantModule.changeState(data.state)
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
