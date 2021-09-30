<template>
  <el-link
    :href="state.value"
    :disabled="state.disabled"
    :type="state.type"
    :underline="state.underline"
    :icon="state.icon"
    target="_blank"
  >
    <span v-if="state.displayContent === 'link'">{{ state.value }}</span>
    <i
      v-else
      class="el-icon-document"
    />
  </el-link>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import LinkState from './LinkState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'TableColumn',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): LinkState {
    return this.$state as LinkState
  }
}
</script>

<style lang="scss" scoped>
.el-link {
  color: #409EFF;
  font-weight: 400 !important;
}
</style>
