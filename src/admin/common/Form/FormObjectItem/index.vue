<template>
  <el-card class="card">
    <el-button
      v-if="state.isAddItem"
      type="primary"
      @click="handleClick"
    >
      自定义字段
    </el-button>
    <Form :path="getChildPath('')" />
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
import { runFlowByFile } from '@/arkfbp'

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

  async created() {
    if (this.state.init) {
      const { path, method } = this.state.init
      await runFlowByFile('flows/common/customFields/init', { url: path, method: method.toUpperCase(), com: this })
    }
  }

  handleClick() {
    this.show = true
    const items = this.state.items
    if (!items) return
    const keys = Object.keys(items)
    this.values = keys
  }

  add() {
    this.values.push(this.value.trim())
    this.value = ''
  }

  close(index: number) {
    this.$delete(this.state.items!, this.values[index])
    this.values.splice(index, 1)
  }

  confirm() {
    const values = this.values
    const keys = Object.keys(this.state.items!)
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]
      if (keys.indexOf(value) < 0) {
        this.$set(this.state.items!, value, {
          label: value,
          type: 'Input',
          prop: value,
          state: {
            value: '',
            placeholder: `请输入${value}`
          }
        })
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
    margin: 5px;
  }
}
</style>
