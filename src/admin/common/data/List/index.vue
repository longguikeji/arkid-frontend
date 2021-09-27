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
        :class="{'is-pointer': item.type === 'link' || item.type === 'detail'}"
      >
        <el-badge
          v-if="item.badge"
          :value="item.badge.value"
        >
          <div @click="handleClick(item)">
            {{ getLabel(item) }}
          </div>
        </el-badge>
        <div
          v-else
          @click="handleClick(item)"
        >
          {{ getLabel(item) }}
        </div>
        <i
          v-if="state.clearable"
          class="el-icon-delete"
          @click="clearItem(item)"
        />
      </li>
    </ul>
    <el-dialog
      v-if="item"
      :visible.sync="visible"
      :title="item.label"
    >
      {{ item.value }}
    </el-dialog>
  </Card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListItemState, { ListState } from './ListState'
import BaseVue from '@/admin/base/BaseVue'
import Card from '@/admin/common/Card/index.vue'

@Component({
  name: 'List',
  components: {
    Card
  }
})
export default class extends Mixins(BaseVue) {
  private visible = false
  private item: ListItemState | null = null

  get state(): ListState {
    return this.$state as ListState
  }

  getLabel(item: ListItemState) {
    return item.label?.length > 25 ? `${item.label.substring(0, 25)} ...` : item.label
  }

  handleClick(item: ListItemState) {
    const { type, value } = item
    if (type === 'link' && value) {
      window.open(value, '_blank')
    } else if (type === 'detail' && value) {
      this.item = item
      this.visible = true
    }
  }

  clearItem(item: ListItemState) {
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
    padding: 10px;
    box-sizing: border-box;
    &.is-pointer {
      cursor: pointer;
    }
    &:hover {
      background-color: #f5f6f8;
      border-radius: 10px;
    }
    .el-icon-delete {
      float: right;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
::v-deep .el-badge__content.is-fixed {
  right: 0px;
}
::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: bold;
}
</style>
