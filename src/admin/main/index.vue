<template>
  <div
    v-if="state"
    :class="page"
  >
    <AdminComponent
      v-for="(name, index) in names"
      :key="index"
      :path="`admin.adminState[${name}]`"
    />
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
import { isArray, isObject } from 'lodash'

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

  private get names(): string[] {
    return typeof this.page === 'string' ? [this.page] : this.page
  }

  async created() {
    if (this.page) {
      await runFlowByFile('flows/initPage', { page: this.page, state: {} }).then(async(result) => {
        if (Object.keys(result).length > 0) {
          await AdminModule.setAdmin(result)
        }
      })
    }
  }

  async destroyed() {
    await AdminModule.setAdmin(null)
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/group.scss';
@import '../../styles/desktop.scss';
@import '../../styles/contacts.scss';

.placeholder {
  text-align: center;
  padding-top: 50px;
}

iframe {
  width: 100%;
  height: calc(100vh - 90px);
}
</style>
