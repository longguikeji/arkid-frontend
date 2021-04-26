<template>
  <div
    v-if="state && initCompleted"
    style="height: 100%"
  >
    <DashboardPage
      v-if="state.type === 'DashboardPage'"
      :path="'admin.adminState'"
    />
    <FormPage
      v-if="state.type === 'FormPage'"
      :path="'admin.adminState'"
    />
    <TablePage
      v-if="state.type === 'TablePage'"
      :path="'admin.adminState'"
    />
    <TreePage
      v-if="state.type === 'TreePage'"
      :path="'admin.adminState'"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AdminModule } from '@/store/modules/admin'
import DashboardPage from '@/admin/DashboardPage/index.vue'
import FormPage from '@/admin/FormPage/index.vue'
import TablePage from '@/admin/TablePage/index.vue'
import TreePage from '@/admin/TreePage/index.vue'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI, { ITagPage } from '@/config/openapi'
import getInitContent from '@/utils/get-init-content'

@Component({
  name: 'Admin',
  components: {
    DashboardPage,
    FormPage,
    TablePage,
    TreePage
  }
})
export default class extends Vue {
  private initCompleted = false

  private get state() {
    return AdminModule.adminState
  }

  async created() {
    const currentPage = this.$route.meta.page
    const initContent: ITagPage | undefined = getInitContent(currentPage)
    if (!initContent) {
      throw Error('This Page is not initContent Source, Please Check OpenAPI')
    }
    if (initContent.type) {
      let state
      // confirm page type
      let type = ''
      switch (initContent.type) {
        case 'table_page':
          type = 'tablePage'
          break
        case 'form_page':
          type = 'formPage'
          break
        case 'tree_page':
          type = 'treePage'
          break
        case 'dashboard_page':
          type = 'dashboardPage'
          break
      }
      // execute init page flow file
      const initFileName = 'flows/' + type + '/init'
      await runFlowByFile(initFileName, {
        initContent: initContent
      }).then(data => {
        state = data.state
      })
      // execute special page content
      if (currentPage === 'maketplace') {
        await runFlowByFile('flows/maketplace/initFilter', {
          state: state,
          initContent: initContent
        }).then(async(data) => {
          state = data.state
        })
      }
      if (currentPage === 'third_party_account') {
        await runFlowByFile('flows/thirdPartyAccount/addUnbindButton', {
          state: state,
          initContent: initContent
        }).then(async(data) => {
          state = data.state
        })
      }
      await AdminModule.setAdmin(state)
      this.initCompleted = true
    } else {
      throw Error('This page is not page-type, check admin-main file')
    }
  }

  async destroyed() {
    await AdminModule.setAdmin(null)
  }
}
</script>
