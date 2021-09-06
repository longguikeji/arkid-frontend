<template>
  <span v-if="state.readonly">{{ state.value }} </span>
  <div v-else>
    <el-input
      v-model="state.value"
      :type="state.type"
      :maxlength="state.maxlength"
      :minlength="state.minlength"
      :show-word-limit="state.showWordLimit"
      :placeholder="state.placeholder"
      :clearable="state.clearable || true"
      :show-password="state.showPassword"
      :disabled="state.disabled"
      :size="state.size"
      :rows="state.rows"
      :autosize="state.autosize"
      :autocomplete="state.autocomplete"
      @blur="onBlur"
    >
      <template
        v-if="state.type === 'link' && state.disabled !== true"
        slot="append"
      >
        <el-upload
          action=""
          :http-request="upload"
          :show-file-list="false"
        >
          <el-button size="small">
            点击上传
          </el-button>
        </el-upload>
      </template>
    </el-input>
    <svg-icon
      v-if="state.required"
      class="required"
      name="required"
      width="20"
      height="20"
    />
    <div
      v-if="hint"
      class="error-hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import InputState from './InputState'
import BaseVue from '@/admin/base/BaseVue'
import { validate } from '@/utils/rules'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'Input',
  components: {}
})
export default class extends Mixins(BaseVue) {
  private hint = ''

  get state(): InputState {
    return this.$state as InputState
  }

  onBlur() {
    const { name, value, format, hint, required, pattern } = this.state
    this.hint = validate(value, name, format, hint, required, pattern)
  }

  async upload(data: any) {
    await runFlowByFile('arkfbp/flows/upload', { com: this, data })
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
}
.col {
  margin: 12px;
  flex: auto;
}
.error-hint {
  color: #f53e3e;
  position: absolute;
  font-size: 12px;
}
</style>
