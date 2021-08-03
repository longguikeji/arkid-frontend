<template>
  <el-card class="card">
    <Form :path="getChildPath('')" />
    <template v-if="state.isAddItem">
      <el-button
        type="primary"
        @click="show = true"
      >
        点击添加
      </el-button>
    </template>
    <el-dialog
      :visible="show"
      :modal="false"
      @close="show = false"
    >
      <el-card>
        <div slot="header">
          <b>自定义字段编辑</b>
          <el-input
            v-model="value"
            placeholder="输入字段名"
          >
            <el-button
              slot="append"
              @click="add"
            >
              添加字段
            </el-button>
          </el-input>
        </div>
        <el-tag
          v-for="(item, index) in values"
          :key="index"
          closable
          class="tag"
          @close="close(index)"
        >
          {{ item }}
        </el-tag>
      </el-card>
      <div slot="footer">
        <el-button @click="show = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirm"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Form from '@/admin/common/Form/index.vue'
import BaseVue from '@/admin/base/BaseVue'
import FormObjectItemState from './FormObjectItemState'

@Component({
  name: 'FormObjectItem',
  components: {
    Form
  }
})
export default class extends Mixins(BaseVue) {
  private show = false
  private value = ''
  private values: string[] = []

  get state(): FormObjectItemState {
    return this.$state as FormObjectItemState
  }

  add() {
    this.values.push(this.value)
    this.value = ''
  }

  close(index: number) {
    this.values.splice(index, 1)
  }

  confirm() {
    const values = this.values
    let items = this.state.items
    if (!items) items = {}
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]
      items[i] = {
        label: value,
        type: 'Input',
        state: {
          value: '',
          placeholder: `请输入${value}`
        }
      }
    }
    this.show = false
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: inline-block;
  width: 100%;
  .tag {
    margin-left: 10px;
  }
}
</style>
