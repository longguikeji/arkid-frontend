<template>
  <i
    :title="state.type"
    :class="iconClass(state.type)"
    @click.stop="sort()"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SortState from './SortState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'SortItem',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): SortState {
    return this.$state as SortState
  }

  iconClass(type: string) {
    switch (type) {
      case 'up':
        return 'el-icon-top el__icon__sort'
      case 'down':
        return 'el-icon-bottom el__icon__sort'
      case 'top':
        return 'el-icon-download el__icon__sort el__icon__sort__top'
      case 'bottom':
        return 'el-icon-download el__icon__sort'
    }
  }

  sort() {
    if (this.state?.action) {
      this.runAction(this.state.action)
    }
  }
}
</script>

<style lang="scss" scoped>
.el__icon__sort {
  font-weight: 700;
  margin-left: 2px;
  margin-right: 2px;
  &:hover {
    cursor: pointer;
    color: #007bff;
  }
}
.el__icon__sort__top {
  transform: scaleY(-1);
}
</style>
