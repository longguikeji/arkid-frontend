<template>
  <div>
    <el-select
      v-model="state.value"
      :placeholder="state.placeholder"
      :multiple="state.multiple"
      :clearable="state.clearable"
      :disabled="state.disabled"
      :size="state.size"
      @change="changeSelectValue"
      @visible-change="changeVisible"
    >
      <template v-if="state.type === 'group'">
        <el-option-group
          v-for="(group, groupIndex) in state.options"
          :key="groupIndex"
          :label="group.label"
          :disabled="state.disabled"
        >
          <el-option
            v-for="(item, index) in group.options"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-option-group>
      </template>
      <template v-else>
        <el-option
          v-for="(item, index) in state.options"
          :key="index"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </template>
    </el-select>
    <svg-icon
      v-if="state.required"
      class="required"
      name="required"
      width="20"
      height="20"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Tag from '@/admin/common/data/Tag/index.vue'
import SelectState from './SelectState'
import BaseVue from '@/admin/base/BaseVue'
import { runFlowByFile } from '@/arkfbp'

@Component({
  name: 'Select',
  components: {
    Tag
  }
})
export default class extends Mixins(BaseVue) {
  get state(): SelectState {
    return this.$state as SelectState
  }

  async changeSelectValue() {
    if (this.state.action) {
      await this.runAction(this.state.action)
    }
  }

  async changeVisible(val: boolean) {
    if (val && this.state.url) {
      await runFlowByFile('arkfbp/flows/options', { com: this, url: this.state.url })
    }
  }
}
</script>

<style lang="scss" scoped></style>
