<template>
  <Card
    :path="getChildPath('header')"
    class="list-card"
  >
    <ul v-if="state.items.length">
      <li
        v-for="(item, index) in state.items"
        :key="index"
        :title="item.label"
      >
        {{ getLabel(item) }}
        <i
          v-if="state.clearable"
          class="el-icon-delete"
          @click="handleClick(item)"
        />
      </li>
    </ul>
  </Card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListItemState, { ListState } from './ListState'
import BaseVue from '@/admin/base/BaseVue'
import ListItem from './ListItem/index.vue'
import Card from '@/admin/common/Card/index.vue'

@Component({
  name: 'List',
  components: {
    ListItem,
    Card
  }
})
export default class extends Mixins(BaseVue) {
  get state(): ListState {
    return this.$state as ListState
  }

  getLabel(item: ListItemState) {
    return item.label?.length > 25 ? `${item.label.substring(0, 25)} ...` : item.label
  }

  handleClick(item: ListItemState) {
    this.runAction(item.action)
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
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
}
</style>
