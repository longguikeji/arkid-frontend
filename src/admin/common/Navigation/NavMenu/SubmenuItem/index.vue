<template>
  <el-submenu
    v-if="state.children"
    :index="state.title"
    :popper-class="state.popperClass"
    :show-timeout="state.showTimeout"
    :hide-timeout="state.hideTimeout"
    :disabled="state.disabled"
    :popper-append-to-body="state.popperAppendToBody"
  >
    <template slot="title">
      <i
        v-if="state.icon"
        :class="state.icon"
      />{{ state.title }}
    </template>
    <template v-for="(child, index) in state.children">
      <SubmenuItem
        :key="child.title + index"
        :state="getChildPath('children[' + index + ']')"
      />
    </template>
  </el-submenu>
  <el-menu-item
    v-else
    :index="state.title"
    :route="state.route"
    :disabled="state.disabled"
  >
    <i
      v-if="state.icon"
      :class="state.icon"
    />{{ state.title }}
  </el-menu-item>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SubmenuState from './SubmenuState'
import MenuItemState from './MenuItemState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'SubmenuItem',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): any {
    return this.$state as any
  }
}
</script>

<style lang="scss" scoped>
</style>
