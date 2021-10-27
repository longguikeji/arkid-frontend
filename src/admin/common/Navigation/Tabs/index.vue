<template>
  <el-tabs
    v-model="state.value"
    :type="state.type"
    :closable="state.closable"
    :addable="state.addable"
    :editable="state.editable"
    :tab-position="state.tabPosition"
    :stretch="state.stretch"
  >
    <el-tab-pane
      v-for="(item, index) in state.items"
      :key="index"
      :label="item.label"
      :name="item.name"
      :lazy="item.lazy"
      :disabled="item.disabled"
      :closable="item.closable"
    >
      <template v-if="item.name === state.value">
        <AdminComponent :path="getTabPath(item)" />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import TabsState from './TabsState'
import TabPaneState from './TabPaneState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Tabs',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): TabsState {
    return this.$state as TabsState
  }

  get tabPath() {
    return `admin.adminState[${this.state.value}]`
  }

  get prefix() {
    return this.path.substring(0, this.path.indexOf('.$tabs'))
  }

  getTabPath(item: TabPaneState) {
    return `${this.prefix}[${item.name}]`
  }
}
</script>
