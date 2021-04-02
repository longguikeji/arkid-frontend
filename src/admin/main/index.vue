<template>
  <div v-if="state && initCompleted">
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
      if (initContent.type === 'table_page') {
        await runFlowByFile('flows/tablePage/init', {
          initContent: initContent
        }).then(async(data) => {
          await AdminModule.setAdmin(data.state)
          this.initCompleted = true
        })
      } else if (initContent.type === 'form_page') {
        await runFlowByFile('flows/formPage/init', {
          initContent: initContent
        }).then(async(data) => {
          await AdminModule.setAdmin(data.state)
          this.initCompleted = true
        })
      } else if (initContent.type === 'tree_page') {
        await runFlowByFile('flows/treePage/init', {
          initContent: initContent
        }).then(async(data) => {
          await AdminModule.setAdmin(data.state)
          this.initCompleted = true
        })
      }
    }
  }

  async destroyed() {
    await AdminModule.setAdmin(null)
  }
}
</script>
