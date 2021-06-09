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
    >
      <template slot="append">
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
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import InputLinkState from './InputLinkState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'InputLink',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): InputLinkState {
    return this.$state as InputLinkState
  }

  async upload(data: any) {
    this.state.file = data.file
    await this.runAction(this.state.action)
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
</style>
