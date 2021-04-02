<template>
  <div>
    <template v-for="(item, index) in state">
      <i
        :key="index"
        :title="item.type"
        :class="iconClass(item.type)"
        @click.stop="sort(item.type)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SortState from './SortState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Sort',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): Array<SortState> {
    return this.$state as Array<SortState>
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

  sort(sortType: string) {
    if (this.state) {
      this.state.forEach(sortItem => {
        if (sortItem.type === sortType) {
          this.runAction(sortItem.action)
        }
      })
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
