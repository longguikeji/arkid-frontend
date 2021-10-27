<template>
  <div>
    <el-collapse
      v-model="activeName"
      accordion
      class="collapse-list"
    >
      <el-collapse-item
        name="is-active"
        class="collapse-list-content"
        :disabled="state.disabled"
      >
        <template slot="title">
          <span>{{ state.title }}</span>
          <span
            v-if="state.buttons"
            class="list-buttons"
          >
            <ButtonArray :path="getChildPath('buttons')" />
          </span>
        </template>
        <div
          v-for="(item, index) in items"
          :key="index"
          class="collapse-list-item"
          @click="handleClick(item)"
        >
          {{ item.label }}
          <i
            v-if="state.clearable"
            class="el-icon-delete"
            @click="handleClear(index)"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
    <template v-if="state.detail">
      <Dialog :path="getChildPath('detail')" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import ListState, { ListItemState } from './ListState'
import Dialog from '@/admin/common/Dialog/index.vue'

@Component({
  name: 'List',
  components: {
    Dialog
  }
})
export default class extends Mixins(BaseVue) {
  private activeName = 'no-active'

  get state(): ListState {
    return this.$state as ListState
  }

  get items() {
    return this.state.items
  }

  handleClick(item: ListItemState) {
    const data = item.data
    if (data) {
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        this.showDetail(data)
      }
    }
  }

  showDetail(data: any) {
    const detail = this.state.detail
    if (detail) {
      const items = detail.state.state.items
      Object.keys(items).forEach(key => {
        const i = items[key]
        if (data && data[key]) {
          i.value = data[key]
        }
      })
      detail.visible = true
    }
  }

  handleClear(index: number) {
    const items = this.state.items
    items!.splice(index, 1)
  }

  created() {
    this.initActiveStatus()
  }

  initActiveStatus() {
    if (this.state.isActive) {
      this.activeName = 'is-active'
    } else {
      this.activeName = 'no-active'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__header {
  font-size: 16px;
  padding: 18px 10px;
  border-radius: 2px 2px 0px 0px;
  border-bottom: 1px solid #e6ebf5;
  height: 55px;
  font-weight: bold;
}

.list-buttons {
  position: absolute;
  right: 40px;
  top: 3px;
}

::v-deep .collapse-list-item {
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    background-color: #f5f6f8;
  }
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

::v-deep .el-collapse-item.is-disabled .el-collapse-item__header {
  color: #303133;
  cursor: text;
  .el-collapse-item__arrow {
    display: none;
  }
}
</style>
