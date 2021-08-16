<template>
  <li
    :title="state.label"
  >
    {{ label }}
    <i
      class="el-icon-delete"
      @click="handleClick"
    />
  </li>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import ListItemState from './ListItemState'

@Component({
  name: 'ListItem'
})
export default class extends Mixins(BaseVue) {
  @Prop({ required: false }) index?: number

  get state(): ListItemState {
    return this.$state as ListItemState
  }

  get label(): string {
    return this.state.label?.length > 25 ? `${this.state.label.substring(0, 25)} ...` : this.state.label
  }

  handleClick() {
    this.runAction(this.state.action)
  }
}
</script>

<style lang="scss" scoped>
li {
  width: 100%;
  padding: 3px;
  box-sizing: border-box;
  &:hover {
    background-color: #f5f6f8;
  }
  .el-icon-delete {
    float: right;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
