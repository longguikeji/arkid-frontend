<template>
  <el-tabs
    v-model="state.value"
    :type="state.type"
    :closable="state.closable"
    :addable="state.addable"
    :editable="state.editable"
    :tab-position="state.tabPosition"
    :stretch="state.stretch"
    @edit="handleTabsEdit"
  >
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="item.label + index"
      :label="item.label"
      :name="item.name"
      :lazy="item.lazy"
      :disabled="item.disabled"
      :closable="item.closable"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import TabsState from './TabsState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Tabs',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): TabsState {
    return this.$state as TabsState
  }

  editableTabsValue = '2';
  editableTabs: Array<any> = this.state.items.slice(0);
  tabIndex: number = this.state.items.length;

  handleTabsEdit(targetName: any, action: string) {
    if (action === 'add') {
      const newTabName = ++this.tabIndex + ''
      this.editableTabs.push({
        label: 'New Tab',
        name: newTabName,
        content: 'New Tab content',
        closable: true
      })
      this.editableTabsValue = newTabName
    }
    if (action === 'remove') {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
