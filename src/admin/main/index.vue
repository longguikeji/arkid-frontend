<template>
  <div
    v-if="state && initCompleted"
    style="height: 100%"
  >
    <div v-if="isMultiPage">
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AdminModule } from '@/store/modules/admin'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI, { ITagPage } from '@/config/openapi'
import getInitContent from '@/utils/get-init-content'
import BaseVue from '@/admin/base/BaseVue'

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
    return Array.isArray(this.state)
  }

  async created() {
    const currentPage = this.$route.meta.page
    const initContent: ITagPage | undefined = getInitContent(currentPage)
    if (!initContent) {
      throw Error('This Page is not initContent Source, Please Check OpenAPI')
    } else {
      let state
      // execute init page flow file
      await runFlowByFile('flows/initPage', {
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
    }
  }

  async destroyed() {
    await AdminModule.setAdmin(null)
  }
}
</script>
