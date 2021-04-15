<template>
  <el-dialog
    :visible.sync="isShow"
    :show-close="isShowClose"
    fullscreen
    @closed="goHome"
  >
    <table-page
      v-if="initCompleted"
      path="tenant.tenantState"
    />
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import TablePage from '@/admin/TablePage/index.vue'
import { TenantModule } from '@/store/modules/tenant'
import TablePageState from '@/admin/TablePage/TablePageState'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI, { ITagPage } from '@/config/openapi'
import getInitContent from '@/utils/get-init-content'

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

  private get state():TablePageState {
    return TenantModule.tenantState as TablePageState
  }

  goHome() {
    this.$router.push('/')
  }

  async created() {
    this.isShow = true
    // 执行查看 TenantModule.currentTenant 当前的内容，如果不存在uuid，则设置isShowClose为false
    const currentTenant = TenantModule.currentTenant
    if (currentTenant?.uuid?.length) this.isShowClose = true
    const currentPage = this.$route.meta.page
    const initContent: ITagPage | undefined = getInitContent(currentPage)
    if (!initContent) {
      throw Error('This Page is not initContent Source, Please Check OpenAPI')
    }
    await runFlowByFile('flows/tablePage/init', {
      initContent: initContent
    }).then(async(data) => {
      await runFlowByFile('flows/tenant/addSwitchTenant', {
        tempState: data.state,
        router: this.$router
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
