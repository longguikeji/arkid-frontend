<template>
  <el-menu
    :mode="state.mode"
    :collapse="state.collapse"
    :background-color="state.backgroundColor"
    :text-color="state.textColor"
    :active-text-color="state.activeTextColor"
    :default-active="state.defaultActive"
    :default-openeds="state.defaultOpeneds"
    :unique-opened="state.uniqueOpened"
    :menu-trigger="state.menuTrigger"
    :router="state.router"
    :collapse-transition="state.collapseTransition"
  >
    <template v-for="(childItem, childIndex) in state.children">
      <el-submenu
        v-if="childItem.children"
        :key="childIndex"
        :index="childItem.title"
        :popper-class="childItem.popperClass"
        :show-timeout="childItem.showTimeout"
        :hide-timeout="childItem.hideTimeout"
        :disabled="childItem.disabled"
        :popper-append-to-body="childItem.popperAppendToBody"
      >
        <template slot="title">
          {{ childItem.title }}
        </template>
        <template v-for="(secChildItem, secChildIndex) in childItem.children">
          <SubmenuItem
            :key="secChildIndex"
            :state="getChildPath('children[' + childIndex + '].children[' + secChildIndex + ']')"
          />
        </template>
      </el-submenu>
      <el-menu-item
        v-else
        :key="childIndex"
        :index="childItem.title"
        :route="childItem.route"
        :disabled="childItem.disabled"
      >
        {{ childItem.title }}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SubmenuItem from './SubmenuItem/index.vue'
import NavMenuState from './NavMenuState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'NavMenu',
  components: {
    SubmenuItem
  }
})
export default class extends Mixins(BaseVue) {
  get state(): NavMenuState {
    return this.$state as NavMenuState
  }
}
</script>

<style lang="scss" scoped>
</style>
