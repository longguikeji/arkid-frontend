<template>
  <el-dropdown
    :size="state.size"
    :placement="state.placement"
    :trigger="state.trigger"
    :hide-on-click="state.hideOnClick"
    :show-timeout="state.showTimeout"
    :hide-timeout="state.hideTimeout"
    :tabindex="state.tabindex"
    @command="handleCommand"
  >
    <el-button
      v-if="state.splitButton === true"
      :type="state.type"
    >
      {{ state.title
      }}<i
        v-if="!state.isNeedArrow && state.isNeedArrow !== false"
        class="el-icon-arrow-down el-icon--right"
      />
    </el-button>
    <span
      v-else
      class="el-dropdown-link"
    >
      {{ state.title
      }}<i
        v-if="!state.isNeedArrow && state.isNeedArrow !== false"
        class="el-icon-arrow-down el-icon--right"
      />
    </span>
    <el-dropdown-menu v-if="state.items.length > 0">
      <el-dropdown-item
        v-for="(item, index) in state.items"
        :key="index"
        :command="item.command"
        :disabled="item.disabled"
        :divided="item.divided"
        :icon="item.icon"
      >
        {{ item.content }}
      </el-dropdown-item>
    </el-dropdown-menu>
    <el-dropdown-menu v-else>
      <el-dropdown-item>暂无数据</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DropdownState from './DropdownState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Dropdown',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): DropdownState {
    return this.$state as DropdownState
  }

  handleCommand(command: any) {
    this.$message('click on item ' + command)
  }
}
</script>

<style lang="scss" scoped>
</style>
